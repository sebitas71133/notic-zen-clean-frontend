// import React from "react";

// const TabPanel = ({ children, value, index }) => {
//   return (
//     <Box hidden={value !== index}>
//       {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
//     </Box>
//   );
// };

// import { useState, useEffect } from "react";
// import {
//   Box,
//   Container,
//   Grid2,
//   Paper,
//   Typography,
//   Button,
//   Card,
//   CardContent,
//   CircularProgress,
//   Tabs,
//   Tab,
// } from "@mui/material";
// import {
//   Delete as DeleteIcon,
//   Warning as WarningIcon,
//   Image as ImageIcon,
// } from "@mui/icons-material";

// import { useSelector } from "react-redux";
// import {
//   deleteOrphanImagesFromFirestore,
//   getOrphanImages,
// } from "../../firebase/Orphan";
// import {
//   deleteOrphanImagesFromCloudinary,
//   getCloudinaryImages,
// } from "../../cloudinary/cloudinaryProviders";

// export const CloudinaryView = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [metrics, setMetrics] = useState({
//     totalImages: 0,
//     orphanedImages: 0,
//     totalStorage: 0,
//     orphanedStorage: 0,
//   });

//   const [orphanImages, setOrphanImages] = useState([]);
//   const [clouidyImages, setCloudiImages] = useState([]);
//   const [userImages, setUserImages] = useState([]);

//   const [tabIndex, setTabIndex] = useState(0);

//   const { imagesFromCloud, globalImages } = useSelector((state) => state.users);

//   useEffect(() => {
//     // Simulate API call to get images

//     const getData = async () => {
//       const { orphanImages, totalImages, userImages } = await getOrphanImages();
//       const { cloudiImages, totalImages: totalCloudinary } =
//         await getCloudinaryImages();

//       setOrphanImages(orphanImages);
//       setCloudiImages(cloudiImages);
//       setUserImages(userImages);

//       setMetrics((prev) => ({
//         ...prev,
//         totalCloudinary, // Total de imágenes en Cloudinary
//         Firestore: totalImages, // Para tu métrica de Firestore
//         orphanedImages: orphanImages.length, // Total de huérfanas
//       }));

//       setIsLoading(false);
//     };

//     getData();
//   }, []);

//   const handleDeleteHuerfanas = async () => {
//     try {
//       if (orphanImages.length === 0) {
//         console.log("✅ No hay imágenes huérfanas para eliminar.");
//         return;
//       }

//       console.log("🔥 Eliminando imágenes huérfanas...");

//       // 1️⃣ Eliminar imágenes huérfanas de Cloudinary
//       await deleteOrphanImagesFromCloudinary(orphanImages);

//       // 2️⃣ Eliminar referencias de imágenes huérfanas en Firestore
//       await deleteOrphanImagesFromFirestore(orphanImages);

//       // 3️⃣ Limpiar la UI y actualizar la lista
//       setOrphanImages([]);

//       await getData();

//       console.log("✅ Imágenes huérfanas eliminadas exitosamente.");
//     } catch (error) {
//       console.error("Error al eliminar todas las imágenes huérfanas:", error);
//     }
//   };

//   if (isLoading) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//         }}
//       >
//         <CircularProgress />
//         <Typography variant="h6" sx={{ ml: 2 }}>
//           Cargando datos de Cloudinary...
//         </Typography>
//       </Box>
//     );
//   }

//   return (
//     <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
//       <Typography
//         variant="h4"
//         gutterBottom
//         component="div"
//         sx={{ fontWeight: "bold", mb: 4 }}
//       >
//         Dashboard de Gestión de Imágenes
//       </Typography>

//       {/* Metrics Cards */}
//       <Grid2 container spacing={3} sx={{ mb: 4 }}>
//         <Grid2 item xs={12} sm={6} md={3}>
//           <Card sx={{ height: "100%" }}>
//             <CardContent>
//               <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//                 <ImageIcon color="primary" sx={{ mr: 1 }} />
//                 <Typography variant="h6" component="div">
//                   Cloudinary Total
//                 </Typography>
//               </Box>
//               <Typography
//                 variant="h3"
//                 component="div"
//                 sx={{ fontWeight: "bold" }}
//               >
//                 {metrics.totalCloudinary}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid2>
//         <Grid2 item xs={12} sm={6} md={3}>
//           <Card
//             sx={{
//               height: "100%",
//               bgcolor: metrics.Firestore > 0 ? "#fff8e1" : "white",
//             }}
//           >
//             <CardContent>
//               <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//                 <WarningIcon color="warning" sx={{ mr: 1 }} />
//                 <Typography variant="h6" component="div">
//                   Firestore Total
//                 </Typography>
//               </Box>
//               <Typography
//                 variant="h3"
//                 component="div"
//                 sx={{
//                   fontWeight: "bold",
//                   color: metrics.Firestore > 0 ? "warning.main" : "inherit",
//                 }}
//               >
//                 {metrics.Firestore}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid2>
//         <Grid2 item xs={12} sm={6} md={3}>
//           <Card
//             sx={{
//               height: "100%",
//               bgcolor: metrics.orphanedImages > 0 ? "#fff8e1" : "white",
//             }}
//           >
//             <CardContent>
//               <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//                 <WarningIcon color="warning" sx={{ mr: 1 }} />
//                 <Typography variant="h6" component="div">
//                   Unreferenced
//                 </Typography>
//               </Box>
//               <Typography
//                 variant="h3"
//                 component="div"
//                 sx={{
//                   fontWeight: "bold",
//                   color:
//                     metrics.orphanedImages > 0 ? "warning.main" : "inherit",
//                 }}
//               >
//                 {metrics.orphanedImages}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid2>
//       </Grid2>

//       <Grid2>
//         <Tabs
//           value={tabIndex}
//           onChange={(e, newIndex) => setTabIndex(newIndex)}
//         >
//           <Tab label={`Usuarios (${userImages.length})`} />
//           <Tab label={`Huérfanas (${orphanImages.length})`} />
//         </Tabs>

//         <TabPanel value={tabIndex} index={0}>
//           {userImages.length === 0 ? (
//             <Typography>No hay imágenes de usuarios.</Typography>
//           ) : (
//             <Grid2 container spacing={2}>
//               {userImages.map((img, index) => (
//                 <Grid2 item xs={6} sm={4} md={3} key={index}>
//                   <Box>
//                     <img
//                       src={img.url}
//                       alt={img.email}
//                       style={{ width: "100%", borderRadius: 8 }}
//                     />
//                     <Typography variant="body2">{img.email}</Typography>
//                   </Box>
//                 </Grid2>
//               ))}
//             </Grid2>
//           )}
//         </TabPanel>

//         <TabPanel value={tabIndex} index={1}>
//           {orphanImages.length === 0 ? (
//             <Typography>No hay imágenes huérfanas.</Typography>
//           ) : (
//             <Grid2 container spacing={2}>
//               {orphanImages.map((img, index) => (
//                 <Grid2 item xs={6} sm={4} md={3} key={index}>
//                   <Box>
//                     <img
//                       src={img.url}
//                       alt={`Huérfana ${index}`}
//                       style={{ width: "100%", borderRadius: 8 }}
//                     />
//                   </Box>
//                 </Grid2>
//               ))}
//             </Grid2>
//           )}
//         </TabPanel>
//         <Grid2>
//           <Button
//             variant="contained"
//             color="error"
//             startIcon={<DeleteIcon />}
//             onClick={handleDeleteHuerfanas}
//             disabled={orphanImages.length === 0}
//           >
//             Eliminar todas las huérfanas
//           </Button>
//         </Grid2>
//       </Grid2>

//       <Paper sx={{ p: 2 }}>
//         <Typography variant="h6">
//           Imágenes de Cloudinary ({clouidyImages.length})
//         </Typography>

//         {isLoading ? (
//           <Typography>Cargando...</Typography>
//         ) : clouidyImages.length === 0 ? (
//           <Typography>No hay imágenes de Cloudinary.</Typography>
//         ) : (
//           <Grid2 container spacing={2}>
//             {clouidyImages.map((image) => (
//               <Grid2 item xs={6} sm={4} md={3} key={Image}>
//                 <Box position="relative">
//                   <img
//                     src={image}
//                     alt={image}
//                     style={{ width: "100%", borderRadius: 8 }}
//                   />
//                 </Box>
//               </Grid2>
//             ))}
//           </Grid2>
//         )}
//         <Grid2></Grid2>
//       </Paper>
//     </Container>
//   );
// };

import {
  useGetAllImagesQuery,
  useCleanOrphanImagesMutation,
} from "../../../services/noteApi";

export const CloudinaryView = () => {
  const {
    data: imagesData,
    isLoading: isLoadingImages,
    isError,
  } = useGetAllImagesQuery();
  const [cleanOrphanImages, { isLoading: isCleaning }] =
    useCleanOrphanImagesMutation({});

  if (isLoadingImages) return <div>Cargando imágenes...</div>;
  if (isError || !imagesData?.data)
    return <div>Error al cargar las imágenes.</div>;

  const { cloudinaryImages, cloudinaryImagesBD, externalImagesBD } =
    imagesData.data;

  const handleCleanOrphanImages = async () => {
    try {
      const res = await cleanOrphanImages().unwrap();
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📷 Vista de Imágenes</h2>

      <div style={{ marginBottom: 20 }}>
        <button
          onClick={handleCleanOrphanImages}
          disabled={isCleaning}
          style={{
            padding: "8px 16px",
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {isCleaning ? "Limpiando..." : "🧹 Eliminar Imágenes Huérfanas"}
        </button>
      </div>

      <div>
        <h3>📦 Total en Cloudinary (API): {cloudinaryImages.length}</h3>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {cloudinaryImages.map((id) => (
            <img
              key={id}
              src={id}
              alt={id}
              style={{
                width: 120,
                height: 120,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
          ))}
        </div>
      </div>

      <div>
        <h3>🗂️ En BD (Cloudinary): {cloudinaryImagesBD.length}</h3>
        {cloudinaryImagesBD.map((url) => (
          <img
            key={url}
            src={url}
            alt={url}
            style={{
              width: 120,
              height: 120,
              objectFit: "cover",
              borderRadius: 8,
            }}
          />
        ))}
      </div>

      <div>
        <h3>🌐 En BD (externas): {externalImagesBD.length}</h3>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {externalImagesBD.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt="Imagen externa"
              style={{
                width: 120,
                height: 120,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
