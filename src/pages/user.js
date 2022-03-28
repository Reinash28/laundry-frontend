import React from "react";
import { Modal } from "bootstrap";
import axios from "axios";
import { end } from "@popperjs/core";
import { baseUrl } from "../config.js"
import { getRole } from "../config.js";
import { authorization } from "../config.js";

class User extends React.Component {
    constructor() {
        super()
        this.state = {
            users: [
            ],
            id_user: "",
            nama: "",
            username: "",
            password: "",
            role: ""
        }
        if (!localStorage.getItem("token")) {
            window.location.href = "/login"
        }
    }

    tambahData() {
        //memunculkan modal
        this.modalUser = new Modal(document.getElementById("modal-user"))
        this.modalUser.show()

        //mengosongkan inputannya
        this.setState({
            id_user: Math.random(1, 999), action: "tambah",
            nama: "",
            username: "",
            password: "",
            role: ""
        })
    }

    simpanData(event) {
        event.preventDefault()
        //mencegah berjalannya aksi default dari form submit

        //menghilangkan modal
        this.modalUser.hide()

        //cek aksi tambah atau ubah
        if (this.state.action == "tambah") {
            let endpoint = `${baseUrl}/users`
            //menampung data dari pengguna
            let data = {
                id_user: this.state.id_user,
                nama: this.state.nama,
                username: this.state.username,
                password: this.state.password,
                role: this.state.role
            }
            if (this.state.fillPassword === true) {
                data.password = this.state.password
            }

            axios.post(endpoint, data, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))

        } else if (this.state.action == "ubah") {
            this.modalUser.hide()
            let endpoint = `${baseUrl}/users/` + this.state.id_user

            let index = this.state.users.findIndex(
                user => user.id_user === this.state.id_user
            )

            let data = {
                id_user: this.state.id_user,
                nama: this.state.nama,
                username: this.state.username,
                role: this.state.role
            }

            axios.put(endpoint, data, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))

        }
    }

    ubahData(id_user) {
        this.modaluser = new Modal(document.getElementById("modal-user"))
        this.modaluser.show()

        let index = this.state.users.findIndex(
            user => user.id_user === this.state.id_user
        )

        this.setState({
            id_user: this.state.users[index].id_user,
            nama: this.state.users[index].nama,
            username: this.state.users[index].username,
            password: this.state.password,
            action: "ubah",
            fillPassword: false,
        })
    }

    akses(user) {
        let role = getRole();

        if (role === "Admin") {
            return (
                <div className="col-lg-1">
                    <button type="button" class="btn btn-outline-primary btn-lg px-5 text-primary btn-sm"
                        onClick={() => this.ubahData(user.id_user)}>
                        Edit
                    </button>
                    <button type="button" className="btn btn-outline-danger btn-lg px-5 text-danger btn-sm"
                        onClick={() => this.hapusData(user.id_user)}>
                        Hapus</button>
                </div>
            )
        } else {
            return;
        }
    }

    showPassword() {
        if (this.state.fillPassword == true) {
            return (
                <div>
                    <small className="text-white h5">Password</small> <br />
                    <input type="password" Classname="form-control mb-2" required value={this.state.password}
                        onChange={ev => this.setState({ password: ev.target.value })} />
                </div>
            )
        } else {
            return (
                <div>
                    <small className="text-white h5">Password</small> <br />
                    <button className="btn btn-outline-primary btn-lg px-5 text-primary btn-md"
                        onClick={() => this.setState({ fillPassword: true })}>
                        Change Password
                    </button>
                </div>
            )
        }
    }

    hapusData(id_user) {
        if (window.confirm("Apakah anda yakin ingin menghapus data ini?")) {
            let endpoint = `${baseUrl}/users/` + id_user
            axios.delete(endpoint, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))
        }
    }

    getData() {
        let endpoint = `${baseUrl}/users`
        axios.get(endpoint, authorization)
            .then(response => {
                this.setState({ users: response.data })
            })
    }

    componentDidMount() {
        //dijalankan setelah render
        this.getData()
    }

    render() {
        return (
            <div className="gradient-custom repeatku">
                <div className="container"
                    style={{
                        margin: "auto",
                        width: "50%",
                        padding: "150px 0"
                    }}>
                    <div className="card bg-secondary border-white">
                        <div className="card-header bg-dark ">
                            <h4 className="text-white text-lg-center">
                                List Daftar User
                            </h4>
                            <h5 className="kecil text-white">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</h5>
                        </div>
                        <div className="card-body bg-dark">
                            <ul className="list-group">
                                {this.state.users.map(user => (
                                    <li className="list-group-item bg-dark">
                                        <div className="row bg-dark">
                                            <div className="col-lg-5">
                                                <small className="text-white h5">Nama</small> <br />
                                                <h5 className="text-white kecil">{user.nama}</h5>
                                            </div>
                                            <div className="col-lg-2">
                                                <small className="text-white h5">Username</small> <br />
                                                <h5 className="text-white kecil">{user.username}</h5>
                                            </div>
                                            <div className="col-lg-2">
                                                <small className="text-white h5">Role</small> <br />
                                                <h5 className="text-white kecil">{user.role}</h5>
                                            </div>

                                            {this.akses()}

                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <h5 className="kecil text-white">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</h5>
                            <br />
                            <div className="d-flex justify-content-end">
                                <button type="button" class="btn btn-outline-light btn-lg px-5 text-success"
                                    onClick={() => this.tambahData()}>
                                    Tambah User
                                </button>
                            </div>
                        </div>
                    </div>
                    {/*form user*/}
                    <div className="modal" id="modal-user">
                        <div className="modal-dialog modal-md">
                            <div className="modal-content border-light">
                                <div className="modal-header bg-dark">
                                    <h4 className="text-white text-lg-center">
                                        Form user
                                    </h4>
                                </div>

                                <div className="modal-body bg-dark">
                                    <form onSubmit={ev => this.simpanData(ev)}>
                                        <small className="text-white h5">Nama</small> <br />
                                        <input type="text" className="form-control mb-2"
                                            value={this.state.nama}
                                            onChange={ev => this.setState({ nama: ev.target.value })}
                                            required />

                                        <small className="text-white h5">Username</small> <br />
                                        <input type="text" className="form-control mb-2"
                                            value={this.state.username}
                                            onChange={ev => this.setState({ username: ev.target.value })}
                                            required />

                                        {this.showPassword()}

                                        <small className="text-white h5">Role</small> <br />
                                        <select
                                            className="form-control mb-2"
                                            value={this.state.role}
                                            onChange={(ev) => this.setState({ role: ev.target.value })}
                                        >
                                            <option value="User">Kasir</option>
                                            <option value="Admin">Admin</option>
                                        </select>
                                        <h5 className="kecil text-white">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</h5>
                                        <br /> <br />
                                        <div className="d-flex justify-content-end">
                                            <button className="btn btn-outline-success btn-lg px-5 text-sucess"
                                                type="submit">
                                                Simpan
                                            </button>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default User