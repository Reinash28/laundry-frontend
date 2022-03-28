// import React from "react";
// import { baseUrl } from "../config";
// import axios from "axios";

// export default class Dashboard extends React.Component {
//     constructor() {
//         super()

//         this.state = {
//             jmlMember: 0,
//             jmlPaket: 0,
//             jmlTransaksi: 0
//         }

//         if (!localStorage.getItem("token")) {
//             window.location.href = "/login"
//         }
//     }

//     getSummary() {
//         let endpoint = `${baseUrl}/member`
//         axios.get(endpoint)
//         .then(response => {
//             this.setState({jmlMember: response.data.length})
//         })
//         .catch(error => console.log(error))

//         let endpoint = `${baseUrl}/paket`
//         axios.get(endpoint)
//         .then(response => {
//             this.setState({jmlPaket: response.data.length})
//         })
//         .catch(error => console.log(error))

//         let endpoint = `${baseUrl}/transaksi`
//         axios.get(endpoint)
//         .then(response => {
//             this.setState({jmlTransaksi: response.data.length})
//         })
//         .catch(error => console.log(error))


//     }

//     render() {
//         return (
//             <div className="container">
//                 <div className="row">
//                     <div className="col-lg-4 col-md-6">
//                         <div className="card text-center bg-success m-1 text-white">
//                             <div className="card-body">
//                                 <h4 className="card-title">
//                                     Title Card
//                                 </h4>
//                                 <h2>
//                                     100
//                                 </h2>
//                                 <h6>
//                                     This is Subtitle
//                                 </h6>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="col-lg-4 col-md-6">
//                         <div className="card text-center bg-info m-1 text-white">
//                             <div className="card-body">
//                                 <h4 className="card-title">
//                                     Title Card
//                                 </h4>
//                                 <h2>
//                                     100
//                                 </h2>
//                                 <h6>
//                                     This is Subtitle
//                                 </h6>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="col-lg-4 col-md-6">

//                     </div>
//                 </div>
//             </div>
//         )
//     }
// }