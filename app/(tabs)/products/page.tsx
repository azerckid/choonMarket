async function getProducts() {
    await new Promise((resolve) => setTimeout(resolve, 10000));
}

export default async function Products() {
    const products = await getProducts();
    return (
        <div className="flex min-h-screen items-center justify-center">
            <h1 className="text-2xl font-bold">
                product page
            </h1>
        </div>
    );
}
