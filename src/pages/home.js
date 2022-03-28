import React from "react";
import { Modal } from "bootstrap";
import axios from "axios";
import { end } from "@popperjs/core";
import { baseUrl, authorization, formatNumber } from "../config";

export default class Home extends React.Component {
    constructor() {
        super()
        this.state = {
            jumlahMember: 0,
            jumlahTransaksi: 0,
            jumlahIncome: 0,
            transaksi: [],
        };

        if (!localStorage.getItem("token")) {
            window.location.href = "/login"
        }
    }

    getData() {
        let endpointMember = `${baseUrl}/member`;
        axios
            .get(endpointMember, authorization)
            .then((response) => {
                this.setState({ jumlahMember: response.data.length });
            })
            .catch((error) => console.log(error));

        let endpointTransaksi = `${baseUrl}/transaksi`
        axios
            .get(endpointTransaksi, authorization)
            .then((response) => {
                let dataTransaksi = response.data;
                let income = 0;
                for (let i = 0; i < dataTransaksi.length; i++) {
                    let total = 0;
                    for (let j = 0; j < dataTransaksi[i].detail_transaksi.length; j++) {
                        let harga = dataTransaksi[i].detail_transaksi[j].paket.harga;
                        let qty = dataTransaksi[i].detail_transaksi[j].qty;
                        total += harga * qty;
                        dataTransaksi[i].total = total;
                    }
                    income += total;
                }
                this.setState({
                    transaksi: dataTransaksi,
                    jumlahTransaksi: response.data.length,
                    jumlahIncome: income,
                });
            });
    }

    convertBayar(status) {
        if (status === 0) {
            return <h6 className="text-danger">Belum Dibayar</h6>;
        } else if (status === 1) {
            return <h6 className="text-success">Sudah Dibayar</h6>;
        }
    }

    convertStatus(status) {
        if (status === 1) {
            return <h6 className="text-info">Transaksi baru</h6>;
        } else if (status === 2) {
            return <h6 className="text-warning">Sedang Di Proses</h6>;
        } else if (status === 3) {
            return <h6 className="text-success">Siap Di Ambil</h6>;
        } else if (status === 4) {
            return <h6 className="text-success">Sudah Diambil</h6>;
        }
    }

    componentDidMount() {
        this.getData();
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
                    <h1 className="text-white">Home</h1>
                    <div className="row my-4">
                        <div className="col-lg-4">
                            <div className="card jmlmember">
                                <div className="card-body bg-dark rounded">
                                    <h3 className="card-title text-white">Jumlah Member</h3>
                                    <br />
                                    <h2 className="text-white">{this.state.jumlahMember}</h2>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="card jmltrans">
                                <div className="card-body bg-dark rounded">
                                    <h3 className="card-title text-white">Jumlah Transaksi</h3>
                                    <br />
                                    <h2 className="text-white">{this.state.jumlahTransaksi}</h2>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="card jmlduek">
                                <div className="card-body bg-dark rounded">
                                    <h3 className="card-title text-white">Untung</h3>
                                    <br />
                                    <h2 className="text-white">
                                        Rp {formatNumber(this.state.jumlahIncome)}
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h2 className="my-2 text-white">Aktivitas</h2>
                    <ul className="list-group my-2 aktivitas">
                        {this.state.transaksi.reverse().map((trans, index) => (
                            <li className="list-group-item bg-dark" key={index}>
                                <div className="row my-2">
                                    <div className="col-lg-2">
                                        <h6 className="text-white">Member</h6>
                                        <h6 className="text-white kecil">
                                            {trans.member.nama}
                                        </h6>
                                    </div>
                                    <div className="col-lg-3">
                                        <h6 className="text-white">Tanggal Transaksi</h6>
                                        <h6 className="text-white kecil">
                                            {trans.tgl}
                                        </h6>
                                    </div>
                                    <div className="col-lg-2">
                                        <h6 className="text-white">Pembayaran</h6>
                                        <h6 className="text-white kecil">
                                            {this.convertBayar(trans.dibayar)}
                                        </h6>
                                    </div>
                                    <div className="col-lg-2">
                                        <h6 className="text-white">Status</h6>
                                        <h6 className="text-white kecil">
                                            {this.convertStatus(trans.status)}
                                        </h6>
                                    </div>
                                    <div className="col-lg-3">
                                        <h6 className="text-white">Total Pembayaran</h6>
                                        <h6 className="text-white kecil">
                                            {formatNumber(trans.total)}
                                        </h6>
                                    </div>
                                    <h5 className="kecil text-white">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</h5>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    }
}