import React, { useEffect, useState, useRef } from 'react'
import Web3 from 'web3'
import detectEthereumProvider from '@metamask/detect-provider'
import KryptoBird from '../abis/KryptoBird.json'
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage, MDBBtn } from 'mdb-react-ui-kit'
import './App.css'

function App() {

  const [account, setAccount] = useState('')
  const [contract, setContract] = useState()
  const [totalSupply, setTotalSupply] = useState(0)
  const [kryptobirdz, setKryptobirdz] = useState([])

  const kbInput = useRef()

  useEffect(() => {
    
    connectMetamask()

  }, [])

  function mint(kryptoBird){
    contract.methods.mint(kryptoBird).send({from: account})
    .once('receipt', (receipt) => {
      setKryptobirdz([...kryptobirdz, kryptoBird])
    })
  }

  function connectMetamask(){
    detectEthereumProvider()
    .then(provider => {
      if(provider){
        console.log('ethereum wallet is connected')
        window.web3 = new Web3(provider)
        loadBlockchainData()
      }
      else{
        console.log('no ethereum wallet detected')
      }
    })
    .catch(err => {
      console.log(err)
    })
  }
  
  function loadBlockchainData(){
    window.web3.eth.getAccounts()
    .then(accounts => {
      setAccount(accounts[0])

      window.web3.eth.net.getId()
      .then(networkId => {
        const netwrokData = KryptoBird.networks[networkId]
  
        if(netwrokData){
          const abi = KryptoBird.abi
          const address = netwrokData.address
          const contract = new window.web3.eth.Contract(abi, address)
          setContract(contract)

          contract.methods.totalSupply().call()
          .then(totalSupply => {
            setTotalSupply(totalSupply)

            let temp = [...kryptobirdz]

            for(let i=0;i<totalSupply;i++){
              contract.methods.kryptoBirdz(i).call()
              .then(kryptobird => {
                temp.push(kryptobird)
                if(i === totalSupply - 1){
                  setKryptobirdz(temp)
                }
              })
              .catch(err => console.log(err))
            }

          })
          .catch(err => console.log(err))

        }
        else{
          window.alert('Smart contract not deployed')
        }
      })
      .catch(err => console.log(err))

    })
    .catch(err => console.log(err))
  }

  return (
    <div className='container-filled' >
      <nav className='navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow' >
        <div className='navbar-brand col-sm-3 col-md-2 mr-0' style={{ color: 'white' }} >
          KryptoBirdz NFTs
        </div>
        <ul className='navbar-nav px-3' >
          <li className='nav-item text-nowrap d-none d-sm-none d-sm-block' >
            <small className='text-white' >{account}</small>
          </li>
        </ul>
      </nav>

      <div className='container-fluid mt-1' >
        <div className='row' >
          <main role='main' className='col-lg-12 d-flex text-center' >
            <div className='content mr-auto ml-auto' style={{ opacity: '0.8' }} >
                <h1>KryptoBirdz - NFT Marketplace</h1>
                <form onSubmit={(e) => {
                  e.preventDefault()
                  const kryptoBird = kbInput.current.value
                  mint(kryptoBird)
                }} >
                  <input ref={kbInput} type='text' placeholder='Add a file location' className='form-control mb-1' />
                  <input type='submit' value='MINT' className='btn btn-primary btn-black' style={{ margin: '6px' }} />
                </form>
            </div>
          </main>
        </div>
        <hr></hr>
        <div className='row text-center' >
                {
                  kryptobirdz.map((kryptobird, key) => (
                    <div key={key} >
                        <MDBCard className='token' style={{ maxWidth: '22rem' }}>
                          <MDBCardImage className='img' src={kryptobird} position='top' height='250rem' style={{ marginRight: '4px' }} />
                          <MDBCardBody>
                            <MDBCardTitle>
                              KryptoBirdz
                            </MDBCardTitle>
                            <MDBCardText>
                              The KryptoBirdz are 20 uniquely generated Kbirdz from the cyberpunk cloud galaxy. There is only one of each birch and each bird can only be owned by a single person on the Ethereum blockchain.
                            </MDBCardText>
                            <MDBBtn href={kryptobird} >Download</MDBBtn>
                          </MDBCardBody>
                        </MDBCard>
                    </div>
                  ))
                }
        </div>
      </div>

    </div>
  )
}

export default App