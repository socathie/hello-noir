import { expect } from "chai";
import { ethers } from "hardhat";
import path from "path";

import { compile } from '@noir-lang/noir_wasm';
import { setup_generic_prover_and_verifier, create_proof, verify_proof } from '@noir-lang/barretenberg/dest/client_proofs';


describe("TurboVerifier", function () {
    let verifierContract: any;
    let acir: any;
    let abi: any;
    let prover: any;
    let verifier: any;

    before(async function() {

        const Verifier = await ethers.getContractFactory("TurboVerifier");
        verifierContract = await Verifier.deploy();
        await verifierContract.deployed();

        const compiled_program = compile(path.resolve(__dirname, "../circuits/src/main.nr"));

        acir = compiled_program.circuit;
        abi = compiled_program.abi;
        
        [prover, verifier] = await setup_generic_prover_and_verifier(acir);

    });

    it("Should verify proof in nargo", async function () {
        abi.x = 1;
        abi.y = 2;

        const proof = await create_proof(prover, acir, abi);
        const verified = await verify_proof(verifier, proof);

        expect(verified).eq(true);
    });

    it("Should reject false proof", async function () {
        abi.x = 2;
        abi.y = 2;

        const proof = await create_proof(prover, acir, abi);
        const verified = await verify_proof(verifier, proof);

        expect(verified).eq(false);
    });

    it("Should verify proof in smart contract", async function () {
        abi.x = 2;
        abi.y = 3;

        const proof = await create_proof(prover, acir, abi);
        const sc_verified = await verifierContract.verify(proof); // TODO: resolve error

        expect(sc_verified).eq(true);
    });
});