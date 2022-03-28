import React from "react";
import { Modal } from "bootstrap";
import axios from "axios";
import { end } from "@popperjs/core";
import { authorization, baseUrl, getRole } from "../config.js"

class Paket extends React.Component {
    constructor() {
        super()
        this.state = {
            pakets: [
                {
                    id_paket: "",
                    jenis_paket: "",
                    harga: ""
                }
            ],
            id_paket: "",
            jenis_paket: "",
            harga: ""
        }
        if (!localStorage.getItem("token")) {
            window.location.href = "/login"
        }
    }

    tambahData() {
        //memunculkan modal
        this.modalPaket = new Modal(document.getElementById("modal-paket"))
        this.modalPaket.show()

        //mengosongkan inputannya
        this.setState({
            id_paket: Math.random(1, 999), action: "tambah",
            jenis_paket: "",
            harga: ""
        })
    }

    simpanData(event) {
        event.preventDefault()
        //mencegah berjalannya aksi default dari form submit

        //menghilangkan modal
        this.modalPaket.hide()

        //cek aksi tambah atau ubah
        if (this.state.action == "tambah") {
            let endpoint = `${baseUrl}/paket`
            //menampung data dari pengguna
            let data = {
                id_paket: this.state.id_paket,
                jenis_paket: this.state.jenis_paket,
                harga: this.state.harga
            }

            axios.post(endpoint, data, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))

        } else if (this.state.action == "ubah") {
            this.modalPaket.hide()
            let endpoint = `${baseUrl}/paket/` + this.state.id_paket

            let index = this.state.pakets.findIndex(
                paket => paket.id_paket === this.state.id_paket
            )

            let data = {
                id_paket: this.state.id_paket,
                jenis_paket: this.state.jenis_paket,
                harga: this.state.harga
            }

            axios.put(endpoint, data, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))

        }
    }

    ubahData(id_paket) {
        this.modalPaket = new Modal(document.getElementById("modal-paket"))
        this.modalPaket.show()

        let index = this.state.pakets.findIndex(
            paket => paket.id_paket === id_paket
        )

        this.setState({
            id_paket: this.state.pakets[index].id_paket,
            jenis_paket: this.state.pakets[index].jenis_paket,
            harga: this.state.pakets[index].harga,
            action: "ubah"
        })
    }

    hapusData(id_paket) {
        if (window.confirm("Apakah anda yakin ingin menghapus data ini?")) {
            let endpoint = `${baseUrl}/paket/` + id_paket
            axios.delete(endpoint, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))
        }
    }

    getData() {
        let endpoint = `${baseUrl}/paket`
        axios.get(endpoint, authorization)
            .then(response => {
                this.setState({ pakets: response.data })
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
                                List Daftar Paket
                            </h4>
                            <h5 className="kecil text-white">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</h5>
                        </div>
                        <div className="card-body bg-dark">
                            <ul className="list-group">
                                {this.state.pakets.map(paket => (
                                    <li className="list-group-item bg-dark">
                                        <div className="row bg-dark">
                                            <div className="col-lg-5">
                                                <small className="text-white h5">Nama Paket</small> <br />
                                                <h5 className="text-white kecil">{paket.jenis_paket}</h5>
                                            </div>
                                            <div className="col-lg-5">
                                                <small className="text-white h5">Harga Paket</small> <br />
                                                <h5 className="text-white kecil">{paket.harga}</h5>
                                            </div>
                                            <div className="col-lg-1" />
                                            {this.akses()}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <h5 className="kecil text-white">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</h5>
                            <br /> <br />
                            <div className="d-flex justify-content-end">
                                <button type="button" class="btn btn-outline-light btn-lg px-5 text-success"
                                    onClick={() => this.tambahData()}>
                                    Tambah Paket
                                </button>
                            </div>
                        </div>
                    </div>
                    {/*form paket*/}
                    <div className="modal" id="modal-paket">
                        <div className="modal-dialog modal-md">
                            <div className="modal-content border-light">
                                <div className="modal-header bg-dark">
                                    <h4 className="text-white text-lg-center">
                                        Form Paket
                                    </h4>
                                </div>

                                <div className="modal-body bg-dark">
                                    <form onSubmit={ev => this.simpanData(ev)}>
                                        <small className="text-white h5">Nama Paket</small>
                                        <input type="text" className="form-control mb-2"
                                            value={this.state.jenis_paket}
                                            onChange={ev => this.setState({ jenis_paket: ev.target.value })}
                                            required />

                                        <small className="text-white h5">Harga Paket</small>
                                        <input type="text" className="form-control mb-2"
                                            value={this.state.harga}
                                            onChange={ev => this.setState({ harga: ev.target.value })}
                                            required />
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
export default Paket