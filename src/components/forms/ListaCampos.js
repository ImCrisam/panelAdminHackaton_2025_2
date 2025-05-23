import React from 'react';
import { CampoEditable } from './CampoEditable';

export const ListaCampos = ({ lista }) => (
  <div className="mb-4">
    <h5>{lista.nombre}</h5>
    <p>{lista.descripcion}</p>
    {lista.campos?.map((campo, i) => (
      <CampoEditable campo={campo} key={i} />
    ))}
  </div>
);
