import React, {Component} from 'react'
import axios from 'axios'
import { store } from 'react-notifications-component'

import Main from '../template/Main'

const headerProps = {
    icon: 'user',
    title:'Cadastro de Clientes',
    subtitle: 'Cadastro de cliente X Solar Tech'
}

const baseUrl = 'http://localhost:8000'

const initialState = {
    user: {
        name: '',
        email: '',
        cpf: '',
        phone: '',
        addresses: []
    },
    address: {
        zipcode: '',
        city: '',
        state: '',
        neighborhood: '',
        street: '',
        number: '',
        complement: '',
        type: '',
        mainAddress: false,
    },
    addresses: [],
    list: [],
    idUser: ''
}

export default class UserCrud extends Component{

    state = {...initialState}

    componentWillMount() {
        let idUser = this.props.location.pathname.split('user/')[1]

        if(idUser) {
            axios(baseUrl+`/person/${idUser}`).then(resp => {
                this.setState({addresses: resp.data.addresses})
                let user = {
                    name: resp.data.name,
                    email: resp.data.email,
                    cpf: resp.data.cpf,
                    phone: resp.data.phone,
                }
                this.setState({user})
            })

        } else {
            this.setState({addresses: []})
        }
    }

    clear() {
        this.setState( {
            user: initialState.user,
            address: initialState.address,
            addresses: initialState.addresses,
            idUser: initialState.idUser
        })
        window.location = '/#/users'
    }

    successMessage() {
        return store.addNotification({
            title: "Sucesso!",
            message: "Os dados foram salvos :)",
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

    errorMessage() {
        return store.addNotification({
            title: "Erro!",
            message: "Não foi possível alterar :( verifique os campos e tente novamente!",
            type: "danger",
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
                duration: 8000,
                onScreen: true
            }
        })
    }

    async save() {
        let savedAddress = []
        let idUser = this.props.location.pathname.split('user/')[1]


        if(!idUser) {
            for (let address of this.state.addresses) {
                let resp = await axios['post'](`${baseUrl}/address`, address)
                savedAddress.push(resp.data._id)
            }

            this.state.user.addresses = savedAddress

            if(this.state.user.addresses && this.state.user.cpf && this.state.user.name && this.state.user.email && this.state.user.phone) {
                axios['post'](`${baseUrl}/person`, this.state.user)
                    .then(() => {
                        this.successMessage()
                        window.location = '/#/users'
                    })
                    .catch(() => {
                        this.errorMessage()
                    })
            } else {
                this.errorMessage()
            }

        } else {
            for (let address of this.state.addresses) {
                let resp
                if(!address._id)
                    resp = await axios['post'](`${baseUrl}/address`, address)
                else
                    resp = await axios['put'](`${baseUrl}/address/${address._id}`, address)

                savedAddress.push(resp.data._id)
            }

            this.state.user.addresses = savedAddress

            axios['put'](`${baseUrl}/person/${idUser}`, this.state.user)
                .then(() => {
                    this.successMessage()
                    window.location = '/#/users'
                })
                .catch(() => this.errorMessage())
        }
    }

    setAddress() {
        if(this.state.address.city && this.state.address.complement && this.state.address.neighborhood && this.state.address.number && this.state.address.state && this.state.address.street && this.state.address.type && this.state.address.zipcode) {
            const address = this.state.address
            this.state.addresses.push(address)
            this.setState({address: initialState.address})
        } else {
            this.errorMessage()
        }
    }

    updateField(event) {
        const user = {...this.state.user}
        user[event.target.name] = event.target.value
        this.setState({user})
    }

    updateAddressField(event) {
        const address = {...this.state.address}

        if(event.target.name === 'mainAddress') {
            address['mainAddress'] === false ? address['mainAddress'] = true : address['mainAddress'] = false
            this.setState({addresses: this.state.addresses.map(address => {
                    if(address.mainAddress)
                        address.mainAddress = false
                    return address
                 })
            })
            return this.setState({address})
        }

        const parsed = event.target.value.normalize('NFD').replace(/([\u0300-\u036f]|[^0-9])/g, '')

        if(event.target.name === 'zipcode' && parsed.length === 8) {
            axios.get(`http://viacep.com.br/ws/${parsed}/json/`)
                .then(resp  => {
                    address['zipcode'] = resp.data.cep
                    address['city'] = resp.data.localidade
                    address['state'] = resp.data.uf
                    address['neighborhood'] = resp.data.bairro
                    address['street'] = resp.data.logradouro
                    address['complement'] = resp.data.complemento

                    return this.setState({address})
                })
        }

        address[event.target.name] = event.target.value
        this.setState({address})
    }

    renderForm() {
        return(
            <div className={'Form.jsx'}>
                <div className={'row'}>
                    <div className={'col-12 col-md-6'}>
                        <div className={'form-group'}>
                            <label>Nome</label>
                            <input type={'text'} className={'form-control'} name={'name'}
                                   value={this.state.user.name}
                                   onChange={e => this.updateField(e)}
                                   placeholder={'Digite o nome...'} />
                        </div>
                    </div>
                    <div className={'col-12 col-md-6'}>
                        <div className={'form-group'}>
                                <label>E-mail</label>
                                <input type={'text'} className={'form-control'}
                                name={'email'}
                                value={this.state.user.email}
                                onChange={e => this.updateField(e)}
                                placeholder={'Digite o email...'}/>
                        </div>
                    </div>
                </div>
                <div className={'row'}>
                    <div className={'col-12 col-md-6'}>
                        <div className={'form-group'}>
                            <label>CPF</label>
                            <input type={'text'} className={'form-control'} name={'cpf'}
                                   value={this.state.user.cpf}
                                   onChange={e => this.updateField(e)}
                                   placeholder={'Digite o cpf...'} />
                        </div>
                    </div>
                    <div className={'col-12 col-md-6'}>
                        <div className={'form-group'}>
                            <label>Telefone</label>
                            <input type={'text'} className={'form-control'}
                                   name={'phone'}
                                   value={this.state.user.phone}
                                   onChange={e => this.updateField(e)}
                                   placeholder={'Digite o telefone...'}/>
                        </div>
                    </div>
                </div>
                <hr />
                <div className={'row'}>
                    <div className={'col-12 col-md-6'}>
                        <div className={'form-group'}>
                            <label>CEP</label>
                            <input type={'text'} className={'form-control'} name={'zipcode'}
                                   value={this.state.address.zipcode}
                                   onChange={e => this.updateAddressField(e)}
                                   placeholder={'Digite o CEP...'} />
                        </div>
                    </div>
                    <div className={'col-12 col-md-6'}>
                        <div className={'form-group'}>
                            <label>Cidade</label>
                            <input type={'text'} className={'form-control'}
                                   name={'city'}
                                   value={this.state.address.city}
                                   onChange={e => this.updateAddressField(e)}
                                   placeholder={'Digite a Cidade...'}/>
                        </div>
                    </div>
                </div>
                <div className={'row'}>
                    <div className={'col-12 col-md-6'}>
                        <div className={'form-group'}>
                            <label>Estado</label>
                            <input type={'text'} className={'form-control'} name={'state'}
                                   value={this.state.address.state}
                                   onChange={e => this.updateAddressField(e)}
                                   placeholder={'Digite o Estado...'} />
                        </div>
                    </div>
                    <div className={'col-12 col-md-6'}>
                        <div className={'form-group'}>
                            <label>Bairro</label>
                            <input type={'text'} className={'form-control'}
                                   name={'neighborhood'}
                                   value={this.state.address.neighborhood}
                                   onChange={e => this.updateAddressField(e)}
                                   placeholder={'Digite o Bairro...'}/>
                        </div>
                    </div>
                </div>
                <div className={'row'}>
                    <div className={'col-12 col-md-6'}>
                        <div className={'form-group'}>
                            <label>Rua</label>
                            <input type={'text'} className={'form-control'} name={'street'}
                                   value={this.state.address.street}
                                   onChange={e => this.updateAddressField(e)}
                                   placeholder={'Digite a Rua...'} />
                        </div>
                    </div>
                    <div className={'col-12 col-md-6'}>
                        <div className={'form-group'}>
                            <label>Número</label>
                            <input type={'text'} className={'form-control'}
                                   name={'number'}
                                   value={this.state.address.number}
                                   onChange={e => this.updateAddressField(e)}
                                   placeholder={'Digite o Número...'}/>
                        </div>
                    </div>
                </div>
                <div className={'row'}>
                    <div className={'col-12 col-md-6'}>
                        <div className={'form-group'}>
                            <label>Tipo</label>
                            <select className="form-control" name={'type'}
                                    value={this.state.address.type}
                                    onChange={e => this.updateAddressField(e)}>
                                <option disabled></option>
                                <option>Comercial</option>
                                <option>Residencial</option>
                                <option>Rural</option>
                                <option>Casa de Praia</option>
                            </select>
                        </div>
                    </div>
                    <div className={'col-12 col-md-6'}>
                        <div className={'form-group'}>
                            <label>Complemento</label>
                            <input type={'text'} className={'form-control'}
                                   name={'complement'}
                                   value={this.state.address.complement}
                                   onChange={e => this.updateAddressField(e)}
                                   placeholder={'Digite o Complemento...'}/>
                        </div>
                    </div>
                    <div className={'col-12 d-flex justify-content-start'}>
                        <div className={'form-group'}>
                            <input className={'mr-2'} type="checkbox"
                                   name={'mainAddress'}
                                   onClick={e => this.updateAddressField(e)}
                            />
                            <label>Endereço principal</label>
                        </div>
                    </div>
                </div>
                <div className={'row'}>
                    <div className={'col-12 d-flex justify-content-end'}>
                        <button className={'btn btn-success'}
                                onClick={e => this.setAddress(e)}>
                            Adicionar Endereço
                        </button>
                    </div>
                </div>
                <hr/>

            </div>
        )
    }

    removeAddress(address) {
        this.setState({addresses: this.state.addresses.filter(a => a !== address)})
    }

    load(user) {
        this.setState({user})
    }

    remove(user) {
        axios.delete(`${baseUrl}/${user.id}`).then(resp => {
            const list = this.state.list.filter(u => u !== user)
            this.setState({list})
        })
    }

    renderTable() {
        return (
            <div>
            <table className={'table table-striped mt-4'}>
                <thead>
                <tr>
                    <th>Cep</th>
                    <th>Tipo</th>
                    <th>info</th>
                    <th>Ações</th>
                </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
            <div className={'row'}>
                <span className={'ml-3'}><i className={'fa fa-square'} style={{'color': '#e2c4f2'}}></i> Endereço principal</span>

                <div className={'col-12 d-flex justify-content-end'}>
                <button className={'btn btn-primary'}
                    onClick={e => this.save(e)}>
                    Salvar
                </button>
                <button className={'btn btn-secondary ml-2'}
                        onClick={e => this.clear(e)}>
                    Cancelar
                </button>
                </div>
            </div>
            </div>
        )
    }

    renderRows() {
        return this.state.addresses.map(address => {
            let color = address.mainAddress ? {'backgroundColor': '#e2c4f2'} : {}
            return (
                <tr style={color} key={address.id}>
                    <td>{address.zipcode}</td>
                    <td>{address.type}</td>
                    <td>{address.street}, {address.number}, {address.neighborhood}, {address.city} - {address.state}</td>
                    <td>
                        <button className={'btn btn-danger ml-2'} onClick={() => this.removeAddress(address)}>
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
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
}
