import React from 'react';
import {
  CFormInput,
  CFormTextarea,
  CFormLabel,
  CFormCheck,
  CFormGroup
} from '@coreui/react';

export const CampoEditable = ({ campo }) => {
  switch (campo.tipo) {
    case 'fecha':
    case 'rango_fecha':
      return (
        <div className="mb-3">
          <CFormLabel>{campo.nombre}</CFormLabel>
          <CFormInput type="date" defaultValue={campo.valor} />
        </div>
      );
    case 'booleano':
      return (
        <div className="mb-3">
          <CFormCheck label={campo.nombre} defaultChecked={campo.valor} />
        </div>
      );
    case 'texto_largo':
      return (
        <div className="mb-3">
          <CFormLabel>{campo.nombre}</CFormLabel>
          <CFormTextarea rows={4} defaultValue={campo.valor} />
        </div>
      );
    default:
      return (
        <div className="mb-3">
          <CFormLabel>{campo.nombre}</CFormLabel>
          <CFormInput defaultValue={campo.valor} />
        </div>
      );
  }
};
