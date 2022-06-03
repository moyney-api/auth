/**
 * Before writing tests:
 * 
 * I will only test express functions. The wrapper for firebase will not be tested. I will just assume data is going to correctly behave.
 * (also, it costs money to test writing and deleting in firestore... so.. no).
 * 
 * So to do this, I first need to read about express app structure.
 * Then plan tests around it.
 */

// describe('status endpoint', () => {
//     it('should send a message if any Bearer token is present', async () => {
//         const bearerRequest = await fetch('/status')
//         // expect(bearerRequest).message.toBe('hola mundo')
//         console.log({bearerRequest});
//         expect(1).toBe(1);
//     });
// });
