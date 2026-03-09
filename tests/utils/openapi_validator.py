import yaml
import json
import allure
import re
from openapi_core import Spec, validate_response
from openapi_core.contrib.requests import (
    RequestsOpenAPIRequest,
    RequestsOpenAPIResponse,
)
from openapi_core.validation.response.exceptions import ResponseValidationError
from openapi_core.templating.responses.exceptions import ResponseNotFound


class OpenAPIValidator:
    def __init__(self, spec_path: str):
        with open(spec_path, "r", encoding="utf-8") as f:
            self.spec_dict = yaml.safe_load(f)

        self.spec = Spec.from_dict(self.spec_dict)
        self.coverage_tracker = APICoverageTracker(self.spec_dict)    

    def normalize_path(self, path):
        for spec_path in self.spec_dict["paths"].keys():
            pattern = re.sub(r"\{[^}]+\}", r"[^/]+", spec_path)
            pattern = "^" + pattern + "$"
            if re.match(pattern, path):
                return spec_path
        return path

    def validate_response(self, response):
        openapi_request = RequestsOpenAPIRequest(response.request)
        openapi_response = RequestsOpenAPIResponse(response)
        path = self.normalize_path(response.request.path_url.split("?")[0])

        try:
            validate_response(
                spec=self.spec,
                request=openapi_request,
                response=openapi_response,
            )
            schema_valid = True
        except (ResponseValidationError, ResponseNotFound) as e:
            schema_valid = False
            msg = f"Контракт нарушен: {e}"
        
        self.coverage_tracker.add(
            method=response.request.method,
            path=path,
            status_code=response.status_code,
            schema_valid=schema_valid
        )

        if not schema_valid:
            allure.attach( f"{response.request.method} {response.request.url}",
                name="Запрос", attachment_type=allure.attachment_type.TEXT)
            allure.attach(str(response.status_code), name="Статус-код",
                attachment_type=allure.attachment_type.TEXT)
            try:
                body = json.dumps(response.json(), indent=2, ensure_ascii=False)
                attachment_type = allure.attachment_type.JSON
            except Exception:
                body = response.text
                attachment_type = allure.attachment_type.TEXT
            allure.attach(body, name="Тело ответа",
                attachment_type=attachment_type)
            allure.attach(msg, name="Ошибка контракта",
                attachment_type=allure.attachment_type.TEXT)
            raise AssertionError(msg)


class APICoverageTracker:
    def __init__(self, spec_dict=None):
        self.called_operations = {} 
        self.spec_dict = spec_dict or {}

    def add(self, method, path, status_code=None, schema_valid=True):
        key = (method.upper(), path)
        if key not in self.called_operations:
            expected_status_codes = set()
            if self.spec_dict:
                method_spec = self.spec_dict.get("paths", {}).get(path, {}).get(method.lower(), {})
                responses = method_spec.get("responses", {})
                expected_status_codes = set(int(code) for code in responses.keys() if code.isdigit())

            self.called_operations[key] = {
                "status_codes": set(),
                "schema_valid": [],
                "expected_status_codes": expected_status_codes
            }

        if status_code:
            self.called_operations[key]["status_codes"].add(status_code)
        self.called_operations[key]["schema_valid"].append(schema_valid)

    def report(self):
            return self.called_operations

    @staticmethod
    def get_all_operations(spec_dict):
        operations = set()

        for path, methods in spec_dict["paths"].items():
            for method in methods.keys():
                operations.add((method.upper(), path))
        return operations
