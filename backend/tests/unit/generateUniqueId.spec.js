const generateUniqueId = require('../../src/utils/generateUniqueId')


describe('Generate Unique ID', () => {
  it('should generate an unique ID', () => {  //descrição do teste e execução (it = isto)

    const id = generateUniqueId();

    expect(id).toHaveLength(8)  
  })
})