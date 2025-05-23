import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CContainer,
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
  CFormTextarea,
} from '@coreui/react'

const PanelActualizacion = () => {
  const [panelInfoWeb, setPanelInfoWeb] = useState(null)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_API_URL + '/api/panel-info')
        if (!response.ok) throw new Error('Error al cargar datos')
        const data = await response.json()
        setPanelInfoWeb(data)

        const initialData = {}
        data.campos.forEach((campo) => {
          if (campo.tipo === 'lista' && Array.isArray(campo.campos)) {
            initialData[campo.nombre] = {}
            campo.campos.forEach((sub) => {
              initialData[campo.nombre][sub.nombre] = sub.valor ?? ''
            })
          } else {
            initialData[campo.nombre] = campo.valor ?? ''
          }
        })
        setFormData(initialData)
      } catch (error) {
        console.error('Fetch error:', error)
        setPanelInfoWeb({ campos: [] })
        setFormData({})
      }
    }

    fetchData()
  }, [])

  const handleChange = (campoNombre, value, subCampoNombre = null) => {
    if (subCampoNombre) {
      setFormData((prev) => ({
        ...prev,
        [campoNombre]: {
          ...prev[campoNombre],
          [subCampoNombre]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [campoNombre]: value,
      }))
    }
  }

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

  const handleCancelar = () => {
    if (!panelInfoWeb) return
    const resetData = {}
    panelInfoWeb.campos.forEach((campo) => {
      if (campo.tipo === 'lista' && Array.isArray(campo.campos)) {
        resetData[campo.nombre] = {}
        campo.campos.forEach((sub) => {
          resetData[campo.nombre][sub.nombre] = sub.valor ?? ''
        })
      } else {
        resetData[campo.nombre] = campo.valor ?? ''
      }
    })
    setFormData(resetData)
  }

  if (!panelInfoWeb) return <p>Cargando datos...</p>

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
                return (
                  <div key={idx} className="mb-4">
                    <h5>{campo.nombre}</h5>
                    {campo.descripcion && <p>{campo.descripcion}</p>}
                    {campo.campos.map((sub, subIdx) => (
                      <div key={subIdx} className="mb-2">
                        <CFormLabel>{sub.nombre}</CFormLabel>
                        <CFormInput
                          type={sub.tipo === 'fecha' ? 'date' : 'text'}
                          value={formData?.[campo.nombre]?.[sub.nombre] || ''}
                          onChange={(e) => handleChange(campo.nombre, e.target.value, sub.nombre)}
                        />
                      </div>
                    ))}
                  </div>
                )
              }

              return (
                <div key={idx} className="mb-3">
                  <CFormLabel>{campo.nombre}</CFormLabel>
                  {campo.tipo === 'texto_largo' ? (
                    <CFormTextarea
                      value={formData?.[campo.nombre] || ''}
                      onChange={(e) => handleChange(campo.nombre, e.target.value)}
                    />
                  ) : campo.tipo === 'fecha' ? (
                    <CFormInput
                      type="date"
                      value={formData?.[campo.nombre] || ''}
                      onChange={(e) => handleChange(campo.nombre, e.target.value)}
                    />
                  ) : (
                    <CFormInput
                      type="text"
                      value={formData?.[campo.nombre] || ''}
                      onChange={(e) => handleChange(campo.nombre, e.target.value)}
                    />
                  )}
                </div>
              )
            })}
            <div className="d-flex gap-2 mt-4">
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
  )
}

export default PanelActualizacion
