export default function Fonts({ allparam }: { allparam: string[] }) {
    return (
        <div className="flex flex-col gap-3">
            <h1 className="text-6xl font-metallica">Extras!</h1>
            <h2 className="font-roboto">So much more to learn!</h2>
            <h3 className="font-rubick">Font: {allparam}</h3>
        </div>
    );
} 