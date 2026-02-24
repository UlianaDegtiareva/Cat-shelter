import { HttpException } from '@nestjs/common';

export async function proxyGet(path: string) {
  const baseUrl = 'http://cat-reader:8080'; 
  const response = await fetch(`${baseUrl}${path}`);

  const data = await response.json();

  if (!response.ok) {
    throw new HttpException(
      data.message || 'Reader service error',
      response.status,
    );
  }

  return data;
}