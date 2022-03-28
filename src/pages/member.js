import React from "react";
import { Modal } from "bootstrap";
import axios from "axios";
import { end } from "@popperjs/core";
import { baseUrl } from "../config.js"

class Member extends React.Component {
    constructor() {
        super()
        this.state = {
            members: [
                {
                    id_member: "", nama: "",
                    alamat: "",
                    jenis_kelamin: "", telepon: ""
                }
            ],
            id_member: "",
            nama: "",
            alamat: "",
            telepon: "",
            jenis_kelamin: "",
            action: ""
        }

        if (!localStorage.getItem("token")) {
            window.location.href = "/login"
        }
    }

    tambahData() {
        //memunculkan modal
        this.modalMember = new Modal(document.getElementById("modal-member"))
        this.modalMember.show()

        //mengosongkan inputannya
        this.setState({
            nama: "",
            alamat: "",
            telepon: "",
            jenis_kelamin: "Pria",
            id_member: Math.random(1, 999), action: "tambah"
        })
    }

    simpanData(event) {
        event.preventDefault()
        //mencegah berjalannya aksi default dari form submit

        //menghilangkan modal
        this.modalMember.hide()

        //cek aksi tambah atau ubah
        if (this.state.action == "tambah") {
            let endpoint = `${baseUrl}/member`
            //menampung data dari pengguna
            let data = {
                id_member: this.state.id_member,
                nama: this.state.nama,
                alamat: this.state.alamat,
                telepon: this.state.telepon,
                jenis_kelamin: this.state.jenis_kelamin

            }

            axios.post(endpoint, data)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))

        } else if (this.state.action == "ubah") {
            this.modalMember.hide()
            let endpoint = `${baseUrl}/member/` + this.state.id_member

            let index = this.state.members.findIndex(
                member => member.id_member === this.state.id_member
            )

            let data = {
                id_member: this.state.id_member,
                nama: this.state.nama,
                alamat: this.state.alamat,
                telepon: this.state.telepon,
                jenis_kelamin: this.state.jenis_kelamin

            }
            /*let temp = this.state.members
            temp[index].nama = this.state.nama
            temp[index].alamat = this.state.alamat
            temp[index].telepon = this.state.telepon
            temp[index].jenis_kelamin = this.state.jenis_kelamin*/

            axios.put(endpoint, data)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))

            //this.setState({ members: temp })

        }
    }

    ubahData(id_member) {
        this.modalMember = new Modal(document.getElementById("modal-member"))
        this.modalMember.show()

        //mencari posisi index dari data member
        //berdasartkan id membernya pada array 'members'
        let index = this.state.members.findIndex(
            member => member.id_member === id_member
        )

        this.setState({
            id_member: this.state.members[index].id_member,
            nama: this.state.members[index].nama,
            alamat: this.state.members[index].alamat,
            telepon: this.state.members[index].telepon,
            jenis_kelamin: this.state.members[index].jenis_kelamin,
            action: "ubah"
        })
    }

    hapusData(id_member) {
        if (window.confirm("Apakah anda yakin ingin menghapus data ini?")) {
            let endpoint = `${baseUrl}/member/` + id_member
            axios.delete(endpoint)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))
        }
    }

    getData() {
        let endpoint = `${baseUrl}/member`
        axios.get(endpoint)
            .then(response => {
                this.setState({ members: response.data })
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
                                List Daftar Pembeli
                            </h4>
                            <h5 className="kecil text-white">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</h5>
                        </div>
                        <div className="card-body bg-dark">
                            <ul className="list-group">
                                {this.state.members.map(member => (
                                    <li className="list-group-item bg-dark">
                                        <div className="row bg-dark">
                                            <div className="col-lg-5">
                                                <small className="text-white h5">Nama</small> <br />
                                                <h5 className="text-white kecil">{member.nama}</h5>
                                            </div>
                                            <div className="col-lg-2">
                                                <small className="text-white h5">Gender</small> <br />
                                                <h5 className="text-white kecil">{member.jenis_kelamin}</h5>
                                            </div>
                                            <div className="col-lg-3">
                                                <small className="text-white h5">Telepon</small> <br />
                                                <h5 className="text-white kecil">{member.telepon}</h5>
                                            </div>
                                            <div className="col-lg-1">
                                                <button type="button" class="btn btn-outline-primary btn-lg px-5 text-primary btn-sm"
                                                    onClick={() => this.ubahData(member.id_member)}>
                                                    Edit
                                                </button>
                                                <button type="button" class="btn btn-outline-danger btn-lg px-5 text-danger btn-sm"
                                                    onClick={() => this.hapusData(member.id_member)}>
                                                    Hapus</button>
                                            </div>
                                            <div className="col-lg-12">
                                                <small className="text-white h5">Alamat</small> <br />
                                                <h5 className="text-white kecil">{member.alamat}</h5>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                                <br /> <br />
                            </ul>
                            <h5 className="kecil text-white">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</h5>
                            <br />
                            <div className="d-flex justify-content-end">
                                <button type="button" class="btn btn-outline-light btn-lg px-5 text-success"
                                    onClick={() => this.tambahData()}>
                                    Tambah Member
                                </button>
                            </div>
                        </div>
                    </div>
                    {/*form member*/}
                    <div className="modal" id="modal-member">
                        <div className="modal-dialog modal-md">
                            <div className="modal-content border-light">
                                <div className="modal-header bg-dark">
                                    <h4 className="text-white text-lg-center">
                                        Form user
                                    </h4>
                                </div>

                                <div className="modal-body bg-dark">
                                    <form onSubmit={ev => this.simpanData(ev)}>
                                        <small className="text-white h5">Nama</small>
                                        <input type="text" className="form-control mb-2"
                                            value={this.state.nama}
                                            onChange={ev => this.setState({ nama: ev.target.value })}
                                            required />

                                        <small className="text-white h5">Alamat</small>
                                        <input type="text" className="form-control mb-2"
                                            value={this.state.alamat}
                                            onChange={ev => this.setState({ alamat: ev.target.value })}
                                            required />

                                        <small className="text-white h5">Telepon</small>
                                        <input type="text" className="form-control mb-2"
                                            value={this.state.telepon}
                                            onChange={ev => this.setState({ telepon: ev.target.value })}
                                            required />

                                        <small className="text-white h5">Jenis Kelamin</small>
                                        <select className="form-control mb-2"
                                            value={this.state.jenis_kelamin}
                                            onChange={ev => this.setState({ jenis_kelamin: ev.target.value })}>
                                            <option value="Pria">Pria</option>
                                            <option value="Wanita">Wanita</option>
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
export default Member