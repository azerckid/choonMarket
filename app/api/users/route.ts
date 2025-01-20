import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export async function GET(request: NextRequest) {
    console.log("request", request)
    return NextResponse.json({
        ok: true
    })
}
// 로그인 API 핸들러
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { username: email, password } = body;

        // return NextResponse.json(body)

        // 입력값 검증
        if (!email || !password) {
            return NextResponse.json(
                { error: '이메일과 비밀번호를 모두 입력해주세요.' },
                { status: 400 }
            );
        }

        // TODO: 실제 데이터베이스에서 사용자 조회 로직 추가 필요
        // 예시 코드입니다. 실제 구현시 데이터베이스 연동이 필요합니다.
        const user = await findUserByEmail(email);

        if (!user) {
            return NextResponse.json(
                { error: '존재하지 않는 사용자입니다.' },
                { status: 401 }
            );
        }

        // 비밀번호 검증
        const isValidPassword = await bcrypt.compare(password, user.hashedPassword);

        if (!isValidPassword) {
            return NextResponse.json(
                { error: '비밀번호가 일치하지 않습니다.' },
                { status: 401 }
            );
        }

        // JWT 토큰 생성
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1d' }
        );

        // 쿠키에 토큰 저장
        const response = NextResponse.json(
            {
                message: '로그인 성공',
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name
                }
            },
            { status: 200 }
        );

        response.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 86400 // 24시간
        });

        return response;

    } catch (error) {
        console.error('로그인 에러:', error);
        return NextResponse.json(
            { error: '로그인 처리 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

// 임시 사용자 조회 함수 (실제 구현 필요)
async function findUserByEmail(email: string) {
    // TODO: 데이터베이스 연동 구현
    // 이는 예시 데이터입니다
    return {
        id: '1',
        email: 'test@example.com',
        name: '테스트 사용자',
        hashedPassword: await bcrypt.hash('password123', 10)
    };
}
