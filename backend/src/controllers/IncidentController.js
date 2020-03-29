const connection = require('../database/connection')

module.exports = {
  async index(req, res) {
    const { page = 1 } = req.query;

    const [count] = await connection('incidents').count();

    const incidents = await connection('incidents')
      .join('ongs', 'ongs.id', '=', 'incidents.id_ong')
      .limit(5)  //limite de resultados por busca
      .offset((page - 1) * 5)  //posição inicial a ser retornada
      .select([
        'incidents.*',
        'ongs.name',
        'ongs.email',
        'ongs.whatsapp',
        'ongs.city',
        'ongs.uf',
      ]);

    res.header('X-Total-Count', count['count(*)']);

    return res.json(incidents);
  },

  async store(req, res) {
    const { title, description, value } = req.body;
    const id_ong = req.headers.authorization;

    const [id] = await connection('incidents').insert({
      title,
      description,
      value,
      id_ong,
    });

    return res.json({ id });
  },

  async delete(req, res) {
    const { id } = req.params;
    const id_ong = req.headers.authorization;

    const incident = await connection('incidents')
      .where('id', id)
      .select('id_ong')
      .first();

    if (incident.id_ong !== id_ong) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    await connection('incidents')
      .where('id', id)
      .delete();

    return res.status(204).send();
  },
};
