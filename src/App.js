
import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import hmacSHA256 from 'crypto-js/hmac-SHA256';
import Base64, { stringify }     from 'crypto-js/enc-Base64';

// header for token
const header  = {algo: 'HS256', typ: 'JWT'};

// data being sent
let payload = {name: 'Alice', iat: '1516239022'};

// function encode obj to Base64 representation using btoa
const encode  = obj => makeURLSafe(btoa(JSON.stringify(obj)));

// function to make URL safe by replacing char and removing padding
const makeURLSafe = encoded => encoded.replace(/[+/=]/g, match => encodingReplacements[match]);

// object to relaplace chars +,-,/
const encodingReplacements  = {
    '+':'-',
    '/':'_',
    '=':''
};

// create signature for header and payload using secret 
const secret = '12345';

const makeSignature = (header, payload, secret) => {
    const hashResult  = hmacSHA256(`${encode(header)}.${encode(payload)}`,secret);
    const stringified = Base64.stringify(hashResult);
    return makeURLSafe(stringified);
};


const getJWT = (header, payload, secret) => `${encode(header)}.${encode(payload)}.${makeSignature(header,payload,secret)}`;

const App = () => {
    
    // save data/payload, payload and jwt in state
    const [payloadOut , setPayloadOut] = useState(payload);
    const [jwt, setJWT]    = useState('');

    // controlled form to set name value in data/payload object base don user input
    const onChange         = (event) => {
        setPayloadOut({...payload, "name": event.target.value})
    };
    // create jwt Token using values 
    const generateToken    = (event) => setJWT(getJWT(header, payloadOut, secret));

    return (
        <div>
            <div>JWT Token Generation!</div>
            <br></br>
            <p>Header: {JSON.stringify(header)}</p>
            <br></br>
            <p>Default Payload: {JSON.stringify(payload)}</p>
            <br></br>
            <p>Secret: {secret}</p>
            <br></br>
            <p>Default JWT Token: {getJWT(header, payload, secret)}</p>
            <br></br>
            <p>Change name in data/payload to generate different Token!!</p>
            <br></br>
            <input value={payloadOut['name']} onChange={onChange}></input>
            <p>New Payload: {JSON.stringify(payloadOut)}</p>
            
            <br></br>
            <button onClick = {generateToken}>Generate</button>
            <br></br>
            <br></br>
            <p>JWT Token: {jwt}</p>
            <br></br>
            <p>Compare value with result on <a href= "https://jwt.io/" target = "_blank">jwt.io</a> by entering same header, payload, secret there!!!</p>
        </div>
    );
}

export default App;
