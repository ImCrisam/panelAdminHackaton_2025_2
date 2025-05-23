import React, { useEffect, useState } from 'react'
import { ListaCampos } from './ListaCampos';
import { CampoEditable } from './CampoEditable';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CContainer,
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
} from '@coreui/react';

import panelData from './camposUpdate.json';
const panelInfoWeb = panelData.panel;

const PanelActualizacion = () => {

    const [panelInfoWeb, setPanelInfoWeb] = useState(null)
  const [formData, setFormData] = useState({})

  // Simula un fetch para traer los datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_API_URL + '/api/panel-info')
        if (!response.ok) throw new Error('Error al cargar datos')
        const data = await response.json()
        setPanelInfoWeb(data)

        // Inicializa formData con valores recibidos
        const initialData = {}
        data.campos.forEach((campo) => {
          initialData[campo.label] = campo.valor || ''
        })
        setFormData(initialData)
      } catch (error) {
        console.error('Fetch error:', error)
        // En caso de error, podrías inicializar con un objeto vacío o datos por defecto
        setPanelInfoWeb({ campos: [] })
        setFormData({})
      }
    }

    fetchData()
  }, [])

  // Si no hay panelInfoWeb, mostrar algo (spinner, mensaje, etc.)
  if (!panelInfoWeb) return <p>Cargando datos...</p>

  // Maneja cambios de inputs
  const handleChange = (label, value) => {
    setFormData((prev) => ({
      ...prev,
      [label]: value,
    }))
  }

  // Enviar datos al servidor
  const handleGuardar = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/panel-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error('Error al guardar')
      alert('Datos guardados con éxito')
    } catch (error) {
      alert('Error guardando: ' + error.message)
    }
  }

  // Cancelar (restaurar valores iniciales)
  const handleCancelar = () => {
    const resetData = {}
    panelInfoWeb.campos.forEach((campo) => {
      resetData[campo.label] = campo.valor || ''
    })
    setFormData(resetData)
  }

  return (
    <CContainer className="py-4">
      <CCard>
        <CCardHeader>
          <h3>{panelInfoWeb.titulo}</h3>
        </CCardHeader>
        <CCardBody>
          <CForm>
            {panelInfoWeb.campos.map((campo, idx) => {
              if (campo.tipo === 'lista') {
                return <ListaCampos lista={campo} key={idx} />;
              }
              // Aquí un ejemplo básico con CFormLabel y CFormInput
              return (
                <div className="mb-3" key={idx}>
                  <CFormLabel htmlFor={`campo-${idx}`}>{campo.label}</CFormLabel>
                  <CFormInput
                    id={`campo-${idx}`}
                    type="text"
                    defaultValue={campo.valor || ''}
                    placeholder={campo.placeholder || ''}
                  />
                </div>
              );
            })}
             <div className="d-flex gap-2">
              <CButton color="primary" onClick={handleGuardar}>
                Guardar
              </CButton>
              <CButton color="secondary" onClick={handleCancelar}>
                Cancelar
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default PanelActualizacion;
