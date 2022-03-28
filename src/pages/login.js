import react from "react";
import axios from "axios";
import { end } from "@popperjs/core";
import { baseUrl } from "../config.js"
import "./login.css"

class Login extends react.Component {
    constructor() {
        super()
        this.state = {
            username: "",
            password: ""
        }
    }
    loginProcess(event) {
        event.preventDefault()
        let endpoint = `${baseUrl}/login`
        let request = {
            username: this.state.username,
            password: this.state.password
        }

        axios.post(endpoint, request)
            .then(result => {
                if (result.data.logged) {
                    //simpan token di dalam penyimpanan lokal
                    localStorage.setItem("token", result.data.token)
                    localStorage.setItem(
                        "user", JSON.stringify(result.data.user)
                    )
                    window.alert("Selamat! Anda berhasil login")
                    window.location.href = "/"
                } else {
                    window.alert("Maaf, Username atau password anda salah")
                }
            })
            .catch(error => console.log(error))
    }
    render() {
        return (
            <div className="vh-100 gradient-custom">
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-8 col-lg-6 col-xl-5d">
                            <div className="card bg-dark text-white">
                                <div className="card-body p-5 text-center">
                                    <div class="mb-md-5 mt-md-4 pb-5">

                                        <h2 class="fw-bold mb-2 text-uppercase">Login</h2>
                                        <p class="text-white-50 mb-5">Please enter your login and password!</p>

                                        <form onSubmit={ev => this.loginProcess(ev)}>

                                            <div class="form-outline form-white mb-4">
                                                <input type="text" id="typeEmailX" class="form-control form-control-lg"
                                                    placeholder="Username"
                                                    required value={this.state.username}
                                                    onChange={ev => this.setState({ username: ev.target.value })}
                                                />
                                            </div>

                                            <div class="form-outline form-white mb-4">
                                                <input type="password" id="typePasswordX" class="form-control form-control-lg"
                                                    placeholder="Password"
                                                    required value={this.state.password}
                                                    onChange={ev => this.setState({ password: ev.target.value })}
                                                />
                                            </div><br /><br /><br /><br />

                                            <button class="btn btn-outline-light btn-lg px-5" type="submit">
                                                Login
                                            </button>

                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Login