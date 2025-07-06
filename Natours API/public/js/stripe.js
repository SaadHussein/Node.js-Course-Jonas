import axios from "axios"
import { showAlert } from "./alerts"
const stripe = Stripe('pk_test_51RUDZRQ4LosksAJErhVRHiHGzK79x3uU4JmmcGLyE64Jn9u8DZjVy6YQXI4rFgEemCghWnFbkGj3MtBGXjMRqyxy00M0uUEjKX')

export const bookTour = async tourId => {
    try{
        const session = await axios(`http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`)

        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });
    } catch (err) {
        console.log(err)
        showAlert("error", err)
    }

    console.log(session)
}