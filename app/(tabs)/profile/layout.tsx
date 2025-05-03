export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col mx-auto">
            {children}
        </div>
    );
}