import React, { Component } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';
import User from './user';
import { baseUrl, getRole } from "../config.js"


export default class FormTransaksi extends Component {
    constructor() {
        super()
        this.state = {
            id_member: "",
            tgl: "",
            batas_waktu: "",
            tgl_bayar: "",
            dibayar: false,
            id_user: "",
            detail_transaksi: [],
            members: [],
            pakets: [],
            id_paket: "",
            qty: 0
        }
        let role = getRole();
        if (role ==="User"){
            window.location.href = "/"
            window.alert("Selain Admin tidak dapat mengakses laman ini");
        }
        if (!localStorage.getItem("token")) {
            window.location.href = "/login"
        }

    }

    getMember() {
        let endpoint = `${baseUrl}/member`
        axios.get(endpoint)
            .then(response => {
                this.setState({ members: response.data })
            })
            .catch(error => console.log(error))
    }

    componentDidMount() {
        this.getMember()
        this.getPaket()
    }

    getPaket() {
        let endpoint = `${baseUrl}/paket`
        axios.get(endpoint)
            .then(response => {
                this.setState({ pakets: response.data })
            })
            .catch(error => console.log(error))
    }

    tambahPaket(event) {
        event.preventDefault()
        //menyimpan data paketyang dipilih beserta jumlahnya
        //ke dalam array detail_transaksi
        this.modal.hide()
        let idPaket = this.state.id_paket
        let selectedPaket = this.state.pakets.find(
            paket => paket.id_paket === parseInt(idPaket)
        )
        let newPaket = {
            id_paket: this.state.id_paket,
            qty: this.state.qty,
            jenis_paket: selectedPaket.jenis_paket,
            harga: selectedPaket.harga
        }

        // ambil array detail_transaksi
        let temp = this.state.detail_transaksi
        temp.push(newPaket)
        this.setState({ detail_transaksi: temp })
    }

    hapusDetail(id_paket) {
        if (window.confirm("Apakah anda yakin ingin menghapus data ini ?")) {

            //mencari posisi index dari data yang akan dihapus
            let temp = this.state.detail_transaksi
            let index = temp.findIndex(detail => detail.id_paket === id_paket)

            //menghapus data pada array
            temp.splice(index, 1)

            this.setState({ detail_transaksi: temp })
        }
    }

    addPaket() {
        //menampilkan form untuk memilih paket
        this.modal = new Modal(
            document.getElementById('modal-paket')
        )
        this.modal.show()

        this.setState({
            id_paket: "",
            qty: 0,
            jenis_paket: "",
            harga: 0
        })
    }

    simpanTransaksi() {
        let endpoint = `${baseUrl}/transaksi`;
        let user = JSON.parse(localStorage.getItem("user"))
        let data = {
            id_member: this.state.id_member,
            tgl: this.state.tgl,
            batas_waktu: this.state.batas_waktu,
            tgl_bayar: this.state.tgl_bayar,
            dibayar: this.state.dibayar,
            id_user: user.id_user,
            detail_transaksi: this.state.detail_transaksi,
        };

        axios
            .post(endpoint, data)
            .then((response) => {
                window.alert(response.data.message);
                this.getData();
            })
            .catch((error) => console.log(error));
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
                    <div className="card bg-secondary">
                        <div className="card-header bg-dark">
                            <h4 className="text-white text-lg-center">
                                Form Tansaksi
                            </h4>
                            <h5 className="kecil text-white">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</h5>
                        </div>
                    </div>

                    <div className="card-body bg-dark">
                        <small className="text-white h5">
                            Member
                        </small>
                        <select className="form-control mb-2"
                            value={this.state.id_member}
                            onChange={e => this.setState({ id_member: e.target.value })}>
                            {this.state.members.map(member => (
                                <option value={member.id_member}>
                                    {member.nama}
                                </option>
                            ))}
                        </select>

                        <small className="text-white h5">
                            Tanggal Transaksi
                        </small>
                        <input type="date" className="form-control mb-2"
                            value={this.state.tgl}
                            onChange={e => this.setState({ tgl: e.target.value })} />

                        <small className="text-white h5">
                            Batas Waktu
                        </small>
                        <input type="date" className="form-control mb-2"
                            value={this.state.batas_waktu}
                            onChange={e => this.setState({ batas_waktu: e.target.value })} />

                        <small className="text-white h5">
                            Tanggal Bayar
                        </small>
                        <input type="date" className="form-control mb-2"
                            value={this.state.tgl_bayar}
                            onChange={e => this.setState({ tgl_bayar: e.target.value })} />

                        <small className="text-white h5">
                            Status Bayar
                        </small>
                        <select className="form-control mb-2"
                            value={this.state.dibayar}
                            onChange={e => this.setState({ dibayar: e.target.value })}>
                            <option value={true}>Sudah Dibayar</option>
                            <option value={false}>Belum Dibayar</option>
                        </select>
                        <h5 className="kecil text-white">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</h5>
                        <div className="d-flex justify-content-start">
                            <button className="btn btn-outline-info btn-sm text-info"
                                onClick={() => this.addPaket()}>
                                Tambah Paket
                            </button>
                        </div>
                        <h5>Detail Transaksi</h5>
                        {this.state.detail_transaksi.map(detail => (
                            <div className="row">
                                {/* nama paket */}
                                <div className="col-lg-3">
                                    <small className="text-info">
                                        Nama Paket
                                    </small> <br />
                                    <h5 className="text-white xkecil">
                                        {detail.jenis_paket}
                                    </h5>
                                </div>
                                {/* quantity */}
                                <div className="col-lg-2">
                                    <small className="text-info">
                                        QTY
                                    </small> <br />
                                    <h5 className="text-white xkecil">
                                        {detail.qty}
                                    </h5>
                                </div>
                                {/* harga paket */}
                                <div className="col-lg-3">
                                    <small className="text-info">
                                        Harga Paket
                                    </small> <br />
                                    <h5 className="text-white xkecil">
                                        {detail.harga}
                                    </h5>
                                </div>
                                {/* harga total */}
                                <div className="col-lg-3">
                                    <small className="text-info">
                                        Total Harga
                                    </small> <br />
                                    <h5 className="text-white xkecil">
                                        {detail.qty * detail.harga}
                                    </h5>
                                </div> <br />
                                <div className='col-1'>
                                    <button className='btn btn-outline-danger btn-sm text-danger'
                                        onClick={() => this.hapusDetail(this.state.id_paket)}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                        <h5 className="kecil text-white">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</h5>
                        <hr />
                        <hr />
                        <div className="d-flex justify-content-end">
                            <button className='btn btn-outline-success btn-lg text-success'
                                onClick={() => this.simpanTransaksi()}>
                                Simpan Transaksi
                            </button>
                        </div>
                    </div>

                    <div className="modal" id="modal-paket">
                        <div className="modal-dialog modal-md">
                            <div className="modal-content border-light">
                                <div className="modal-header bg-dark">
                                    <h4 className="text-white text-lg-center">
                                        Pilih Paket
                                    </h4>
                                </div>
                                <div className="modal-body bg-dark">
                                    <form onSubmit={(event) => this.tambahPaket(event)}>
                                        <small className="text-white h5">
                                            Nama Paket
                                        </small>
                                        <select className="form-control mb-2"
                                            value={this.state.id_paket}
                                            onChange={e => this.setState({ id_paket: e.target.value })}>
                                            <option value="">Pilih Paket</option>
                                            {this.state.pakets.map(paket => (
                                                <option value={paket.id_paket}>
                                                    {paket.jenis_paket}
                                                </option>
                                            ))}
                                        </select>
                                        <small className="text-white h5">
                                            Jumlah (Qty)
                                        </small>
                                        <input type="number" className="form-control mb-2"
                                            value={this.state.qty}
                                            onChange={e => this.setState({ qty: e.target.value })} />
                                        <h5 className="kecil text-white">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</h5>
                                        <br /><br />
                                        <div className="d-flex justify-content-end">
                                            <button type='submit' className="btn btn-success">
                                                Tambah
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
