#!/usr/bin/env bash

if [ -f .env ]
then
  export $(cat .env | xargs) 
else
    echo "Please set your .env file"
    exit 1
fi

echo "Deploying verifier"

forge create ./src/plonk_vk.sol:TurboVerifier -i --rpc-url 'https://eth-goerli.alchemyapi.io/v2/'${ALCHEMY_API_KEY} --private-key ${GOERLI_PRIVATE_KEY} | tee deploy.log

echo ""

echo "Verifier deployed successfully 🎉🎉🎉"