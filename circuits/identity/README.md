# Identity Circuits

Anonymous identity verification uses the Semaphore protocol directly.
No custom circuits are needed — Semaphore provides:

- Identity generation (trapdoor + nullifier + commitment)
- Merkle tree membership proofs
- On-chain verification via ISemaphore interface

See `contracts/zk/BSDPrivateIdentity.sol` for the on-chain integration
and `lib/zk/identity.js` for the frontend helpers.
