import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parseSetCookie } from 'cookie';
import { isAxiosError } from 'axios';

import { api } from '../../api';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await api.post('/auth/register', body);

    const setCookie = response.headers['set-cookie'];

    if (setCookie) {
      const cookieStore = await cookies();
      const cookieArray = Array.isArray(setCookie)
        ? setCookie
        : [setCookie];

      for (const cookieString of cookieArray) {
  const parsed = parseSetCookie(cookieString);

  if (parsed.value) {
    cookieStore.set(
      parsed.name,
      parsed.value,
      parsed,
    );
  }
}
    }

    return NextResponse.json(response.data, {
      status: response.status,
    });
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(
        'REGISTER API ERROR:',
        error.response?.status,
        error.response?.data,
      );
      return NextResponse.json(
        {
          error:
            error.response?.data?.error ??
            error.response?.data?.message ??
            error.message,
        },
        {
          status: error.response?.status ?? 500,
        },
      );
    }

    console.error('REGISTER INTERNAL ERROR:', error);

    return NextResponse.json(
      {
        error: 'Internal Server Error',
      },
      {
        status: 500,
      },
    );
  }
}