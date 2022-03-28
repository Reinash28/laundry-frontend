import react from "react";
import axios from "axios";
import React from "react";
import { baseUrl } from "../config";
import ReactDOM from "react-dom";
import Pdf from "react-to-pdf";

const ref = React.createRef();

export default class Transaksi extends React.Component {
    constructor() {
        super()
        this.state = {
            transaksi: []
        }
        if (!localStorage.getItem("token")) {
            window.location.href = "/login"
        }
    }

    getData() {
        let endpoint = `${baseUrl}/transaksi`
        axios
            .get(endpoint)
            .then((response) => {
                let dataTransaksi = response.data;
                for (let i = 0; i < dataTransaksi.length; i++) {
                    let total = 0;
                    for (let j = 0; j < dataTransaksi[i].detail_transaksi.length; j++) {
                        let harga = dataTransaksi[i].detail_transaksi[j].paket.harga;
                        let qty = dataTransaksi[i].detail_transaksi[j].qty;
                        total += harga * qty;
                    }
                    dataTransaksi[i].total = total;
                }
                this.setState({ transaksi: dataTransaksi });
            })
            .catch((error) => console.log(error));
    }

    componentDidMount() {
        this.getData()
    }

    changeStatus(id, status) {
        if (window.confirm(`Apakah anda yakin ingin mengganti status transaksi ini ?`)) {
            let endpoint = `${baseUrl}/transaksi/status/${id}`
            let data = {
                status: status
            }

            axios.post(endpoint, data)
                .then(response => {
                    window.alert(`Status transaksi telah diubah`)
                    this.getData()
                }
                )
                .catch(error => console.log(error))
        }
    }

    convertStatus(id_transaksi, status) {
        if (status === 1) {
            return (
                <div className="badge bg-info rounded-pill">
                    <a onClick={() => this.changeStatus(id_transaksi, 2)} className="text-dark">
                        Transaksi Baru
                    </a> <br />
                </div>
            )
        } else if (status === 2) {
            return (
                <div className="badge bg-warning rounded-pill">
                    <a onClick={() => this.changeStatus(id_transaksi, 3)} className="text-dark">
                        Sedang diproses
                    </a>
                </div>
            )
        } else if (status === 3) {
            return (
                <div className="badge bg-secondary rounded-pill">
                    <a onClick={() => this.changeStatus(id_transaksi, 4)} className="text-dark">
                        Siap diambil
                    </a>
                </div>
            )
        } else if (status === 4) {
            return (
                <div className="badge bg-success rounded-pill">
                    <a className="text-dark">
                        Telah diambil
                    </a>
                </div>
            )
        }
    }

    convertStatusBayar(id_transaksi, dibayar) {
        if (dibayar == 0) {
            return (
                <div className="badge bg-danger text-white">
                    Belum Dibayar
                    <br />
                    <a className="text-white" onClick={() => this.changeStatusBayar(id_transaksi, 1)}>
                        Next
                    </a>
                </div>
            )
        } else if (dibayar == 1) {
            return (
                <div className="badge bg-success">
                    Sudah Dibayar
                </div>
            )
        }
    }

    changeStatusBayar(id, status) {
        if (window.confirm(`Apakah anda yakin ingin mengubah status pembayaran ini?`)) {
            let endpoint = `${baseUrl}/transaksi/bayar/${id}`
            axios.get(endpoint)
                .then(response => {
                    window.alert('Status pembayaran telah berhasil diubah')
                    this.getData()
                }
                )
                .catch(error => console.log(error))
        }
    }

    deleteTransaksi(id) {
        if (window.confirm(`Apakah anda yakin menhghapus transaksi ini?`)) {
            let endpoint = `${baseUrl}/transaksi/${id}`
            axios.delete(endpoint)
                .then(response => {
                    window.alert('Transaksi ini berhasil dihapus')
                    this.getData()
                }
                )
                .catch(error => console.log(error))
        }
    }

    render() {
        return (
            <div className="gradient-custom">
                <div className="container"
                    style={{
                        margin: "auto",
                        width: "50%",
                        padding: "150px 0"
                    }}>
                    <div className="card bg-secondary border-white">
                        <div className="card-header bg-dark ">
                            <h4 className="text-white text-lg-center">
                                List Daftar Transaksi
                            </h4>
                            <h5 className="kecil text-white">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</h5>
                        </div>

                        <div className="card-body bg-dark">
                            <ul className="list-group">
                                {this.state.transaksi.map(trans => (
                                    <li className="list-group-item bg-dark">
                                        <div className="row bg-dark">
                                            <h5 className="xkecil text-white">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</h5>
                                            {/* Member */}
                                            <div className="col-lg-3">
                                                <small className="text-info">
                                                    Member
                                                </small> <br />
                                                <h5 className="text-white xkecil">
                                                    {trans.member.nama}
                                                </h5>
                                            </div>

                                            {/* Transaksi */}
                                            <div className="col-lg-3">
                                                <small className="text-info">
                                                    Tgl. Transaksi
                                                </small> <br />
                                                <h5 className="text-white xkecil">
                                                    {trans.tgl}
                                                </h5>
                                            </div>

                                            {/* Batas Waktu */}
                                            <div className="col-lg-3">
                                                <small className="text-info">
                                                    Batas Waktu
                                                </small> <br />
                                                <h5 className="text-white xkecil">
                                                    {trans.batas_waktu}
                                                </h5>
                                            </div>

                                            {/* Tanggal Bayar */}
                                            <div className="col-lg-3">
                                                <small className="text-info">
                                                    Tgl. Bayar
                                                </small> <br />
                                                <h5 className="text-white xkecil">
                                                    {trans.tgl_bayar}
                                                </h5>
                                            </div>

                                            {/* Status */}
                                            <div className="col-lg-3">
                                                <small className="text-info">
                                                    Status
                                                </small> <br />
                                                {this.convertStatus(trans.id_transaksi, trans.status)}
                                            </div>

                                            <div className="col-lg-3">
                                                <small className="text-info">
                                                    Struk
                                                </small> <br />
                                                <div>
                                                    <Pdf targetRef={ref} filename="struk.pdf">
                                                        {({ toPdf }) => 
                                                        <button onClick={toPdf} className="btn btn-outline-danger btn-lg px-5 text-danger btn-sm">
                                                            Generate Pdf
                                                            </button>}
                                                    </Pdf>
                                                </div>
                                            </div>

                                            <div style={{ display: `none` }}>
                                                <div className="col-lg-6"
                                                    id={`struk${trans.id_transaksi}`}>
                                                    <h3 className="text-center">
                                                        Laundry
                                                    </h3>

                                                    <h5>Member: {trans.member.nama}</h5>
                                                    <h5>Tgl: {trans.tgl}</h5>
                                                </div>
                                            </div>

                                            {/* Status */}
                                            <div className="col-lg-3">
                                                <small className="text-info">
                                                    Status Pembayaran
                                                </small> <br />
                                                {this.convertStatusBayar(trans.id_transaksi, trans.dibayar)}
                                            </div>

                                            <div className="col-lg-3">
                                                <small className="text-info">
                                                    Total Harga
                                                </small> <br />
                                                <h5 className="text-white xkecil">
                                                    Rp {trans.total}
                                                </h5>
                                            </div>

                                            <div className="col-lg-3">
                                                <small className="text-info">
                                                    Option
                                                </small> <br />
                                                <button className="btn btn-sm btn-danger"
                                                    onClick={() => this.deleteTransaksi(trans.id_transaksi)}>
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>

                                        {/* area detail transaksi */}

                                        <h5>Detail Transaksi</h5>
                                        {trans.detail_transaksi.map(detail => (
                                            <div className="row">
                                                {/* nama paket */}
                                                <div className="col-lg-3">
                                                    <small className="text-info">
                                                        Nama Paket
                                                    </small> <br />
                                                    <h5 className="text-white xkecil">
                                                        {detail.paket.jenis_paket}
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
                                                        {detail.paket.harga}
                                                    </h5>
                                                </div>
                                                {/* harga total */}
                                                <div className="col-lg-4">
                                                    <small className="text-info">
                                                        Total
                                                    </small> <br />
                                                    <h5 className="text-white xkecil">
                                                        {detail.qty * detail.paket.harga}
                                                    </h5>
                                                </div>
                                            </div>
                                        ))}
                                        <h5 className="xkecil text-white">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</h5>
                                        <hr />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}