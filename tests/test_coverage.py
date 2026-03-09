import pytest
import json
import allure
from tests.utils.openapi_validator import OpenAPIValidator, APICoverageTracker

@pytest.mark.order(-1)
@pytest.mark.coverage
def test_api_coverage_report(openapi_validator):
    tracker = openapi_validator.coverage_tracker
    spec_dict = openapi_validator.spec_dict

    all_ops = APICoverageTracker.get_all_operations(spec_dict)
    called_ops = tracker.report()

    metrics = {
        "coverage_percent": 0,
        "total_endpoints": len(all_ops),
        "tested_endpoints": [],
        "untested_endpoints": []
    }
    
    tested_keys = set(called_ops.keys())
    metrics["coverage_percent"] = len(tested_keys) / len(all_ops) * 100 if all_ops else 0
    for m, p in sorted(tested_keys):
        tested = called_ops[(m, p)]
        exp = tested["expected_status_codes"]
        got = tested["status_codes"]
        
        status_coverage_percent = round(len(got & exp) / len(exp) * 100, 1) if exp else 100.0
        all_expected_statuses_covered = got.issuperset(exp)
        
        endpoint_data = {
            "method": m,
            "path": p,
            "status_codes": sorted(list(got)),
            "expected_status_codes": sorted(list(exp)),
            "missing_status_codes": sorted(list(exp - got)),
            "schema_passed": all(tested["schema_valid"]),
            "status_codes_coverage_percent": status_coverage_percent,
            "all_expected_statuses_covered": all_expected_statuses_covered
        }
        metrics["tested_endpoints"].append(endpoint_data)

    metrics["untested_endpoints"] = sorted(list(all_ops - tested_keys))
    allure.attach(json.dumps(metrics, indent=2, ensure_ascii=False),
                  name="API Coverage Metrics", attachment_type=allure.attachment_type.JSON)
