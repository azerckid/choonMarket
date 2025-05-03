export default function CreateAccountLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-[70%] mx-auto flex flex-col gap-10 py-8 px-6">
            <div className="flex flex-col gap-2 *:font-medium">
                <h1 className="text-2xl"><span className="text-2xl">🍋 &nbsp;</span>안녕하세요 !</h1>
                <h2 className="text-xl">회원가입 양식을 작성해주세요.</h2>
            </div>
            {children}
        </div>
    )
}