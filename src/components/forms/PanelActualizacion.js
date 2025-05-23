import React from 'react';
import { ListaCampos } from './ListaCampos'
import { CampoEditable } from './CampoEditable'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CContainer
} from '@coreui/react';

import panelData from './camposUpdate.json'
const panelInfoWeb = panelData.panel

const PanelActualizacion = () => {
  return (
    <CContainer className="py-4">
      <CCard>
        <CCardHeader>
          <h3>{panelInfoWeb.titulo}</h3>
        </CCardHeader>
        <CCardBody>
          {panelInfoWeb.campos.map((campo, idx) => {
            return campo.tipo === 'lista' ? (
              <ListaCampos lista={campo} key={idx} />
            ) : (
              <CampoEditable campo={campo} key={idx} />
            );
          })}
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default PanelActualizacion;
