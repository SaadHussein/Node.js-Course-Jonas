import axios from "axios";
import { showAlert } from './alerts';

export const login = async (data) => {
    try {

        const result = await axios({
            method: "POST",
            url: "/api/v1/users/login",
            data: {
                email: data.email,
                password: data.password
            }
        });


        if (result.data.status === 'success') {
            showAlert("success", 'Logged In Successfully.');
            location.assign('/');
        }
    } catch (err) {
        showAlert("error", err.response.data.message);
    }
};

export const logout = async () => {
    try {
        const res = await axios({
            method: "GET",
            url: "/api/v1/users/logout",
        });
     

        if (res.data.status === 'success') {
            location.reload(true);
        }
    } catch (err) {
        showAlert("error", "Error while Logout, Try again Later.");
    }

};