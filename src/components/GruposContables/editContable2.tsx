//** React Imports
import { ChangeEvent, FormEvent, Fragment, ReactNode, useEffect, useState } from 'react'
// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'


// ** Third Party Imports
 import * as yup from 'yup'
 import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import axios from 'axios'
import {
  Select,
  SelectChangeEvent,
  MenuItem,
  Card,
  CardContent,
  CardHeader,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Grid,
  CircularProgress,
  Table
} from '@mui/material'
import React from 'react'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import StepperWrapper from 'src/@core/styles/mui/stepper'
import StepperCustomDot from 'src/views/forms/form-wizard/StepperCustomDot'
import { useAsset } from 'src/context/GruposContabContext'
import { findPermission } from 'src/common/findPermiso'

interface SidebarEditGroupProps {
  ContableId:string;
  open: boolean;
  toggle: () => void;
}

interface UserData {
  _id: string
  assetCategory: string
  usefulLife: number
  subCategory: string[]
}

interface subCategory {
  subCategory:string
}

const showErrors = (field: string, valueLen: number, min: number) => {
  if (valueLen === 0) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`
  } else {
    return ''
  }
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))
const schema = yup.object().shape({
  direction: yup.string().required(),
  // responsible: yup.string().required(),
  supplier: yup.string().required(),
  location: yup.string().required(),
  typeCategoryAsset: yup.string().required(),
  dateAcquisition: yup.string().required(),
  warrantyExpirationDate: yup.string().required(),
  name: yup
    .string()
    .min(3, obj => showErrors('Nombre', obj.value.length, obj.min))
    .matches(/^[A-Za-z ]*$/, 'El nombre solo puede contener letras')
    .required(),
  price: yup.number().moreThan(0, 'El valor debe ser mayor que cero').required()
})

const defaultValues = {
  assetCategory: '',
  usefulLife: 0,
  subCategory: ['']
}

const SidebarEditContable2 : React.FC<SidebarEditGroupProps> = (props) => {

  const { getAsset, updateAsset } = useAsset()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [state, setState] = useState<boolean>(false)
  const [subCategory, setSubCategory] = useState<subCategory[]>([])
  const [activeStep, setActiveStep] = useState<number>(0)

  const ContableId = props.ContableId
  const [asset, setAsset] = useState<UserData>({
    _id: '',
  assetCategory: '',
  usefulLife: 0,
  subCategory: ['']
  })

    // ** Hooks
    const {
      reset,
      control,
      formState: { errors }
    } = useForm({
      defaultValues,
      mode: 'onChange'
    })

    const getData = async () => {
      try {
        // const response = await axios.get<UserData>(`${process.env.NEXT_PUBLIC_API_ACTIVOS}asset/${providerId}`)
        const res = await getAsset(ContableId)
        // const responseData = response.data;
        console.log(res)
        setAsset({
          ...asset,
          _id: res._id,
          assetCategory: res.assetCategory,
          usefulLife: res.usefulLife,
          subCategory: [res.subCategory.subCategory ]
        });


      } catch (error) {
        alert(error);
      }
    }
    useEffect(() => {
      getData()

    }, [])

    const toggleDrawer = () => {
      setIsDrawerOpen(!isDrawerOpen);

    };
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      if (name.startsWith('subCategory.')) {
        const infoCountableField = name.split('.')[1];
        setAsset((prevAsset) => ({
          ...prevAsset,
          subCategory: [value],
        }));
      } else {
        setAsset((prevAsset) => ({ ...prevAsset, [name]: value }));
      }
    };
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = async () => {
      try {
        setIsLoading(true);
        const assetIds = []
        assetIds.push(ContableId)
        const numericsubCategory = asset.subCategory.length > 0 ? asset.subCategory[0] : '';
       const newData = {
          assetIds,
          assetCategory: asset.assetCategory,
          usefulLife: asset.usefulLife,
          subCategory:[numericsubCategory],

        }
        updateAsset(newData);
        console.log(asset)
        toggleDrawer();

       const successStyle = {
         background: 'green', // Color de fondo para éxito
         color: 'white', // Color del texto para éxito
       };
             // Notificación de éxito personalizada
      toast.success('Activo Editado Correctamente', {
        style: successStyle, // Aplica el estilo personalizado
        });
      // toast.success('Activo Creado');
    } catch (error) {
      console.error(error)
      toast.error('Hubo un error al Editar el activo');
    }finally {
      setIsLoading(false); // Establece isLoading en false después de que se complete la operación

    }
  }

  const handleClose = () => {
    // toggle()
    reset()
  }
  return (
    <>
          {findPermission('ACTIVO_EDITAR_GRUPO_CONTABLE_ACT')?(
              <Button variant="outlined" size="small"
                style={{  color:  '#94bb68', borderRadius: '10px',marginRight:'2px' ,marginBottom:'-8px'}}
                onClick={toggleDrawer}>
                <Icon icon='mdi:pencil-outline' fontSize={20} />
              </Button>
           ):(<></>)}

          <Drawer
          anchor="right"
          variant='temporary'
          open={isDrawerOpen}
          //onClose={handleClose}
          onClose={toggleDrawer}
          ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { width: { xs: 400, sm: 500, md: 800, lg: 800 } } }}
          >
            <Header>
          <Typography variant='h6' style={{textTransform: 'uppercase'}}>Editar Grupo Contable</Typography>
          <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
            <Icon icon='mdi:close' fontSize={20} />
          </IconButton>
        </Header>
        <Box sx={{ p: 5 }}>
          <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 3 }}>
          <Typography variant='body2' gutterBottom>
                Nombre De Categoría
              </Typography>
              <Controller
                name='assetCategory'
                control={control}
                render={({ field }) => (
                  <>
                    <TextField
                      {...field}
                      value={asset.assetCategory}
                      id='assetCategory'
                      error={Boolean(errors.assetCategory)}
                      onChange={handleChange}
                      autoComplete='off'
                    />
                  </>
                )}
              />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 6 }}>
            <Typography variant='body2' gutterBottom>
            Vida Útil
              </Typography>
              <Controller
                name='usefulLife'
                control={control}
                render={({ field }) => (
                  <>
                    <TextField
                      {...field}
                      value={asset.usefulLife}
                      id='usefulLife'
                      error={Boolean(errors.usefulLife)}
                      onChange={handleChange}
                      autoComplete='off'
                    />
                  </>
                )}
              />
            </FormControl>
            {/* <FormControl fullWidth sx={{ mb: 3 }}>
          <Typography variant='body2' gutterBottom>
                subcategoria
              </Typography>
              <Controller
                name='subCategory'
                control={control}
                render={({ field }) => (
                  <>
                    <TextField
                      {...field}
                      value={asset.subCategory}
                      id='assetCategory'
                      error={Boolean(errors.subCategory)}
                      onChange={handleChange}
                      autoComplete='off'
                    />
                  </>
                )}
              />
            </FormControl> */}
            <FormControl fullWidth sx={{ mb: 3 }}>
  <Typography variant='body2' gutterBottom>
    Subcategoría
  </Typography>
  <Controller
    name='subCategory'
    control={control}
    render={({ field }) => (
      <>
        <TextField
          {...field}
          value={asset.subCategory.join(', ')}
          id='subCategory'
          error={Boolean(errors.subCategory)}
          onChange={(e) => {
            // Separar la cadena en un array de subCategorías
            const subCategories = e.target.value.split(', ');
            // Actualizar el estado con el nuevo array
            setAsset((prevAsset) => ({ ...prevAsset, subCategory: subCategories }));
          }}
          autoComplete='off'
        />
      </>
    )}
  />
</FormControl>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }} onClick={ handleSubmit }>
                Guardar
              </Button>
              <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
                Cancelar
              </Button>
            </Box>
          </form>
        </Box>

      </Drawer>
    </>
  )

}

export default SidebarEditContable2
