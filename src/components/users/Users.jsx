import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import SweetAlert from 'react-bootstrap-sweetalert'

import Main from '../template/Main'
import {store} from "react-notifications-component"

const headerProps = {
    icon: 'users',
    title:'Lista de Clientes',
    subtitle: 'Lista de clientes X Solar Tech'
}

const baseUrl = 'http://localhost:8000'

const initialState = {
    people: [],
    showAlert: false,
    person: {}
}

export default class Users extends Component{

    state = {...initialState}

    componentWillMount() {
        axios(baseUrl+'/people').then(resp => {
            this.setState({people: resp.data})
        })
    }

    successMessage() {
        return store.addNotification({
            title: "Sucesso!",
            message: "Dados excluídos :)",
            type: "success",
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
                duration: 5000,
                onScreen: true
            }
        })
    }

    async delete(person) {

        for(let address of person.addresses) {
            await axios.delete(`${baseUrl}/address/${address._id}`)
        }

        axios.delete(`${baseUrl}/person/${person._id}`).then(resp => {
            const people = this.state.people.filter(u => u._id !== resp.data._id)
            this.setState({people})
            this.successMessage()
        })
    }



    renderTable() {
        return (
            <div>
                <table className={'table table-striped mt-4'}>
                    <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Telefone</th>
                        <th>CPF</th>
                        <th>Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.renderRows()}
                    </tbody>
                </table>
            </div>
        )
    }

    renderRows() {
        return this.state.people.map(person => {
            return (
                <tr key={person._id}>
                    <td>{person.name}</td>
                    <td>{person.email}</td>
                    <td>{person.phone}</td>
                    <td>{person.cpf}</td>
                    <td>
                        <Link to={`/user/${person._id}`}>
                            <button title={'Ver/Editar Cliente'} className={'btn btn-success ml-2'} >
                                <i className={'fa fa-pencil'}></i>
                            </button>
                        </Link>
                        <button title={'Excluir Cliente'} className={'btn btn-danger ml-2'} onClick={() => this.setState({person: person, showAlert: true})} >
                            <i className={'fa fa-trash'}></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }

    render() {
        return (
            <Main {...headerProps}>
                {this.renderTable()}
                <SweetAlert
                    show={this.state.showAlert}
                    warning
                    showCancel
                    confirmBtnText="Sim, delete isso!"
                    confirmBtnBsStyle="danger"
                    title="Você tem certeza?"
                    onConfirm={() => { this.delete(this.state.person)
                            this.setState({showAlert: false})
                        }
                    }
                    onCancel={() => this.setState({showAlert: false})}
                    focusCancelBtn
                >
                    Esta ação não pode ser revertida!
                </SweetAlert>
            </Main>
        );
    }
}
