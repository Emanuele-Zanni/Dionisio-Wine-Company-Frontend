

export async function createrOrder(products: number[], token:string) {
    try {
        const res = await fetch("api/orders", { 
            method: 'POST',
            headers: {
                "Content-type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify({
                products
            })
        } )
    const orders = await res.json()
    return orders
       } catch (error: any) {
        throw new Error (error)
       } 
}

export async function getOrders(token: string) {
   try {
    const res = await fetch("api/users/orders", { //VER ENDPOINT
        method: 'GET',
        cache: 'no-cache',
        headers: {
            Authorization: token,
        }
    } )
const orders = await res.json()
return orders;
   } catch (error: any) {
    throw new Error (error)
   } 
}