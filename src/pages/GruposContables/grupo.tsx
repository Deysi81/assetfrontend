import React, { useState, ChangeEvent, CSSProperties, Fragment, Ref, forwardRef, ReactElement } from 'react'
import axios from 'axios'
import {
  Button,
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
  Table,
  TableHead,
  Paper,
  Tooltip,
  TooltipProps,
  styled,
  tooltipClasses,
  CircularProgress,
  IconButton,
  Grid,
  TextField,
  SlideProps,
  Slide,
  tableCellClasses,
  ListItemText,
  InputAdornment,
  Link,
  TablePagination,
} from '@mui/material'

import FilterListIcon from '@mui/icons-material/FilterList';
import Icon from 'src/@core/components/icon'
import { useSettings } from 'src/@core/hooks/useSettings'
import { useAsset } from 'src/context/GruposContabContext'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SidebarAddDescripcion from 'src/components/GruposContables/adddescripcion'
import SidebarAddGruposcontable from 'src/components/GruposContables/addcontables'
// import SidebarEditContable from 'src/components/GruposContables/editContable'
import SidebarEditContable2 from '../../components/GruposContables/editContable2'
import { findPermission } from 'src/components/findPermission';

interface Contables {
  _id: string
  assetCategory: string
  usefulLife: number
  subCategory: string[]
}

interface subCategory {
  subCategory:string

}
const AssetList: React.FC = () => {

  // const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState<boolean>(false)
  // const [userIdToDelete, setUserIdToDelete] = useState<string>('')

  const [dates] = useState<string[]>([])
  const [addcontablesOpen, setAddcontablesOpen] = useState<boolean>(false)
  const toggleAddcontablesDrawer = () => setAddcontablesOpen(!addcontablesOpen)
  const { settings } = useSettings()
  const { mode } = settings
  // const [isSidebarEditOpen, setIsSidebarEditOpen] = useState(false);


  //LLAMANDO AL CONTEXTO

let { assets,setassetCategory,setLimit, deleteAsset,page,setPage, limit,totalAssets} = useAsset();

const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState<boolean>(false)
const [userIdToDelete, setUserIdToDelete] = useState<string>('')
const [isSidebarEditOpen, setIsSidebarEditOpen] = useState(false);

const handleDeleteCancelled = () => {
  setIsDeleteConfirmationOpen(false)
}

const handleDeleteConfirmed = async () => {
  setIsDeleteConfirmationOpen(false)
  // Aquí puedes ejecutar la lógica de eliminación del usuario usando el userIdToDelete
  try {
    await axios.delete(`${process.env.NEXT_PUBLIC_PERSONAL}/${userIdToDelete}`)
    // Actualizar la lista de usuarios después de eliminar uno
  } catch (error) {
    console.error(error)
  }
}

const handleDelete = async (id: string) => {
  setUserIdToDelete(id)
  setIsDeleteConfirmationOpen(true)
  deleteAsset(id)


}


// const handleDelete = async (id: string) => {
//   // const assetIds = [...new Set([id, ...selectedRows])].flat();
//   // setUserIdToDelete(id)
//   // setIsDeleteConfirmationOpen(true)
// }

const handleChangeRowsPerPage = (
  event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
) => {
  setLimit(parseInt(event.target.value, 10))
  setPage(0);
};

//filtro para Categorias
const Filter=((e:ChangeEvent<HTMLInputElement>)=>{
  setassetCategory(e.target.value);

})
///MENU OPTION FILTROS PARA NOMBRE CATEGORIA
const [anchorNl, setAnchorNl] = React.useState<null | HTMLElement>(null);

const handleClickNomb = (event: React.MouseEvent<HTMLElement>) => {
  setAnchorNl(event.currentTarget);
};
const handleCloseOptionNomb = () => {
  setAnchorNl(null);
};
///MENU OPTION FILTROS PARA NIT
const [anchorNiTl, setAnchorNiTl] = React.useState<null | HTMLElement>(null);

const handleClickNit = (event: React.MouseEvent<HTMLElement>) => {
  setAnchorNiTl(event.currentTarget);
};
const handleCloseOptionNit = () => {
  setAnchorNiTl(null);
};

const headerStyle = {
  backgroundColor: mode === 'light' ? '#8c90f0' : '#5a5c75',
  color: mode === 'light' ? 'black' : 'white',

  fontFamily: 'Roboto, Arial, sans-serif'
}
const bodystyle: CSSProperties = {
  fontSize: '12.9px',
  height:'50px',
  width: '50px',
  textAlign: 'center',
  // color: mode === 'light' ? 'black' : 'white',
  fontFamily: 'Roboto, Arial, sans-serif',
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)'


}
const headStyle: CSSProperties ={
fontFamily: 'Roboto, Arial, sans-serif',
    fontSize: '13px',
    height:'50px',
    width: '50px',
    color: 'white',
    borderRight: '1px solid rgba(224, 224, 224, 1)',
    borderBottom: '1px solid rgba(224, 224, 224, 1)',
    textAlign: 'center'
}

  return(

    <>
    <Grid container>
    <Grid xs={7} ml={4} lg={15}>
    {findPermission('ACTIVO_CREAR_GRUPO_CONTABLE_ACT')?(
             <Button
             style={{ textTransform: 'uppercase', minWidth: '210px', marginLeft: '-14px', float: 'left' }}
             sx={{ mb: 2, margin: '0 15px 8px 0' }}
             variant='contained'
             onClick={toggleAddcontablesDrawer}
           >
            NUEVO GRUPO CONTABLE
           </Button>
            ):(<></>)}

      <SidebarAddGruposcontable open={addcontablesOpen} toggle={toggleAddcontablesDrawer} />
      </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableHead style={headerStyle}>
            <TableRow sx={{ '& .MuiTableCell-root': { py: (theme) => `${theme.spacing(2)} !important` } }}>
              <TableCell style={headStyle} sx={{
        headerClassName: 'super-app-theme--header',
      }}>
                Acciones
              </TableCell>
              <TableCell style={headStyle}>
              Vida Útil
              </TableCell>

              <TableCell style={headStyle}>
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span >Nombre De Categoría</span>
                <IconButton
                  aria-label="more"
                  id="long-button"
                  aria-controls={anchorNl ? 'long-menu' : undefined}
                  aria-expanded={anchorNl ? 'true' : undefined}
                  aria-haspopup="true"
                  onClick={handleClickNomb}
                  style={{ marginLeft: 'auto' }}
                >
                  <MoreVertIcon />
                </IconButton>
              </div>


              <Menu
                id="long-menu"
                MenuListProps={{
                  'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorNl}
                open={Boolean(anchorNl)}
                onClose={handleCloseOptionNomb}
                PaperProps={{
                  style: {

                    width: '20ch',
                  },
                }}
              >
                    <MenuItem >
                      <ListItemText >
                      <TextField
                       variant="standard"
                        onChange={Filter}
                        label="Buscar Nombre de Categoria"
                        sx={{ flex: 1, borderRadius: '10px' }}
                        autoComplete='off'
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Icon icon='mdi:magnify' />
                            </InputAdornment>
                          ),
                        }}
                      />
                      </ListItemText>
                    </MenuItem>
              </Menu>
            </TableCell>
              <TableCell style={headStyle}>
              Subcategoría (descripción)
              </TableCell>
            </TableRow>
          </TableHead>
          {/* FILTROS */}
          <TableHead style={headStyle}>
           <TableRow sx={{ '& .MuiTableCell-root': { py: (theme: { spacing: (arg0: number) => any; }) => `${theme.spacing(2.8)} !important` } }}>

            <TableCell> </TableCell>
            <TableCell> </TableCell>

            <TableCell >
                      <TextField
                       variant="standard"
                        onChange={Filter}
                        sx={{ flex: 2, borderRadius: '10px' }}
                        autoComplete='off'
                        InputLabelProps={{

                          style: { fontSize: '12px', color: 'grey' } // Ajusta el tamaño de la fuente según tus necesidades
                        }}

                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <FilterListIcon />
                            </InputAdornment>
                          ),
                          style: { fontSize: '14.5px', color: 'grey'  }
                        }}
                      />
            </TableCell>
          </TableRow>
        </TableHead>
          { Array.isArray(assets) && assets.length > 0 ? (
            assets.map(asset => (
              <TableBody key={asset._id}>
                <TableRow sx={{ '& .MuiTableCell-root': { py: theme => `${theme.spacing(2.5)} !important` } }}>
                <TableCell  style={{width: '50px',
                      textAlign: 'center',
                      // color: mode === 'light' ? 'black' : 'white',
                      fontFamily: 'Roboto, Arial, sans-serif',
                      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)'
                  }}>

                      <SidebarEditContable2 ContableId={asset._id} open={isSidebarEditOpen} toggle={()=>setIsSidebarEditOpen(!isSidebarEditOpen)}
                      />
                       {findPermission('ACTIVO_ELIMINAR_GRUPO_CONTABLE_ACT')?(
                          <Button
                          sx={{m:'9px  0 0 0'}}
                          fullWidth
                          size='small'
                          style={{ color: '#e53935', borderRadius: '10px',width: '45px',marginBottom:'1px',top:'0.1px',height:'30.1px' }}
                          variant='outlined'
                        onClick={() => handleDelete(asset._id)}
                      >
                        <Icon icon="mdi:delete-outline" fontSize={18} />
                      </Button>
                        ):(<></>)}

                </TableCell>
                <TableCell
                    style={bodystyle}
                  >
                    {asset.usefulLife}
                  </TableCell>

                <TableCell style={bodystyle}>
                  {asset.assetCategory}
                </TableCell>
                <TableCell style={{fontSize: '12.9px',
                      height:'50px',
                      width: '50px',
                          // color: mode === 'light' ? 'black' : 'white',
                      fontFamily: 'Roboto, Arial, sans-serif',
                      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)'
                  }} >

                        <Grid container spacing={2}>
                        <Grid item xs={10} md={10}>
                        <SidebarAddDescripcion    ContableId={asset._id}   /><br />

                        </Grid>
                        <Grid item xs={6} md={10}>
                        <ul>
                  {asset.subCategory.map((subCategory) => (
                    <li key={subCategory}>{subCategory}</li>
                  ))}
                  </ul>
                        </Grid>
                        </Grid>
                </TableCell>

                </TableRow>
              </TableBody>
            ))
          ):(
            <TableBody>
            <TableRow>
              <TableCell colSpan={12} align="center">
                <CircularProgress /> {/* Loading spinner */}
              </TableCell>
            </TableRow>
          </TableBody>
          )

          }
        </Table>

      </TableContainer>
      <TablePagination
              component="div"
              count={totalAssets} // Asegúrate de reemplazar esto con el valor real de tu conteo de filas
              page={parseInt(page, 10)} // Asegúrate de que page sea un número
              rowsPerPage={parseInt(limit, 10)}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Filas por página"
              rowsPerPageOptions={[2, 5, 10, 100]}
              onPageChange={(event, newPage) => {
                setPage(parseInt(newPage, 10)); // Asegúrate de que newPage sea un número
              }}

            />

    </>
  )
 }

export default AssetList
