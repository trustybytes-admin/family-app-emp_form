import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Container,
  Paper,
  Typography,
  Box,
  Stack,
  Divider,
  Fade,
  Chip,
  Alert,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";

// Styled components for custom look
const SectionPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
  },
}));

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const ResumeForm = () => {
  // State
  const [name, setname] = useState("");
  const [empId, setempId] = useState("");
  const [tagline, settagline] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [highlights, setHighlights] = useState("");
  const [profileImagePath, setProfileImagePath] = useState("");
  const [aboutImagePath, setAboutImagePath] = useState("");
  const [fullData, setFullData] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  // Snackbar State
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [resumeData, setResumeData] = useState({
    education: [],
    workHistory: [],
    skills: [],
    projectDetails: [],
    interestsDetails: [],
  });

  // Handlers
  const handleFileInputChange = (e, setter) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setter(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (event, section, index, field) => {
    const newData = { ...resumeData };
    newData[section][index][field] = event.target.value;
    setResumeData(newData);
  };

  const handleAddItem = (section) => {
    const newData = { ...resumeData };
    const currentSectionData = newData[section];

    // Check if the last item is empty
    if (currentSectionData.length > 0) {
      const lastItem = currentSectionData[currentSectionData.length - 1];
      const isEmpty =
        Object.keys(lastItem).length === 0 ||
        Object.values(lastItem).every(
          (val) => val === "" || val === null || val === undefined
        );

      if (isEmpty) {
        setSnackbarMessage("Please fill out the current item before adding a new one.");
        setSnackbarOpen(true);
        return;
      }
    }

    newData[section].push({});
    setResumeData(newData);
  };

  const handleRemoveItem = (section, index) => {
    const newData = { ...resumeData };
    newData[section].splice(index, 1);
    setResumeData(newData);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setSuccess(false);
    setError(false);
    try {
      const prodata = {
        name: `${name} !`,
        tagline,
        profileImagePath,
      };

      const abtdata = {
        aboutMe,
        highlights: highlights.split(",").map((highlight) => highlight.trim()),
        aboutImagePath,
      };

      const data = {
        aboutData: abtdata,
        profileData: prodata,
        resumeData,
      };

      setFullData(data);

      await axios.post(
        `https://tb-family-qrcode-6f3beee0dd82.herokuapp.com/resume-details/${empId}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setLoading(false);
      setSuccess(true);
      console.log("Form submitted successfully", data);
    } catch (error) {
      setLoading(false);
      setError(true);
      console.error("An error occurred during form submission:", error);
    }
  };

  return (
    <Fade in={true} timeout={800}>
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 700, color: "#1a237e" }}
          >
            Employee Onboarding
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Let's build your professional profile together
          </Typography>
        </Box>

        {/* Personal Details Section */}
        <SectionPaper elevation={3}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
          >
            👤 Personal Details
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Full Name"
                value={name}
                onChange={(e) => setname(e.target.value)}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Employee ID"
                value={empId}
                onChange={(e) => setempId(e.target.value)}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Tagline / Favorite Quote"
                value={tagline}
                onChange={(e) => settagline(e.target.value)}
                fullWidth
                variant="outlined"
                placeholder="e.g. Innovation distinguishes between a leader and a follower."
              />
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  border: "2px dashed #ccc",
                  borderRadius: 2,
                  p: 3,
                  textAlign: "center",
                  bgcolor: "#fafafa",
                }}
              >
                <Button
                  component="label"
                  variant="contained"
                  sx={{ mb: 2 }}
                >
                  Upload Profile Picture
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileInputChange(e, setProfileImagePath)}
                  />
                </Button>
                <Typography variant="body2" color="text.secondary">
                  Passport / Square size recommended
                </Typography>
                {profileImagePath && (
                  <Box sx={{ mt: 2 }}>
                    <img
                      src={profileImagePath}
                      alt="Profile Preview"
                      style={{
                        width: 100,
                        height: 100,
                        objectFit: "cover",
                        borderRadius: "50%",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </SectionPaper>

        {/* About Me Section */}
        <SectionPaper elevation={3}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
          >
            📝 About You
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Short Note About You"
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
                fullWidth
                multiline
                rows={4}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Highlights (comma-separated)"
                value={highlights}
                onChange={(e) => setHighlights(e.target.value)}
                fullWidth
                variant="outlined"
                helperText="e.g. Team Player, Java Expert, Public Speaker"
              />
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  border: "2px dashed #ccc",
                  borderRadius: 2,
                  p: 3,
                  textAlign: "center",
                  bgcolor: "#fafafa",
                }}
              >
                <Button
                  component="label"
                  variant="outlined"
                  sx={{ mb: 2 }}
                >
                  Upload About Image
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileInputChange(e, setAboutImagePath)}
                  />
                </Button>
                <Typography variant="body2" color="text.secondary">
                  Any size
                </Typography>
                {aboutImagePath && (
                  <Box sx={{ mt: 2 }}>
                    <img
                      src={aboutImagePath}
                      alt="About Preview"
                      style={{
                        maxWidth: "100%",
                        maxHeight: 200,
                        borderRadius: "8px",
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </SectionPaper>

        {/* Education Section */}
        <SectionPaper elevation={3}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Typography variant="h5" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              🎓 Education
            </Typography>
            <Button variant="text" onClick={() => handleAddItem("education")}>
              + Add Education
            </Button>
          </Box>
          <Stack spacing={3}>
            {resumeData.education.map((edu, index) => (
              <Fade in={true} key={index}>
                <Box
                  sx={{
                    p: 2,
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                    position: "relative",
                  }}
                >
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleRemoveItem("education", index)}
                    sx={{ position: "absolute", top: 8, right: 8, minWidth: "auto" }}
                  >
                    ✕
                  </Button>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Institution"
                        value={edu.institution || ""}
                        onChange={(e) =>
                          handleInputChange(e, "education", index, "institution")
                        }
                        fullWidth
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Degree"
                        value={edu.degree || ""}
                        onChange={(e) =>
                          handleInputChange(e, "education", index, "degree")
                        }
                        fullWidth
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Date (e.g. 2017-2021)"
                        value={edu.date || ""}
                        onChange={(e) =>
                          handleInputChange(e, "education", index, "date")
                        }
                        fullWidth
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Fade>
            ))}
            {resumeData.education.length === 0 && (
              <Typography variant="body2" color="text.secondary" align="center">
                No education details added yet.
              </Typography>
            )}
          </Stack>
        </SectionPaper>

        {/* Work History Section */}
        <SectionPaper elevation={3}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Typography variant="h5" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              💼 Work History
            </Typography>
            <Button variant="text" onClick={() => handleAddItem("workHistory")}>
              + Add Work
            </Button>
          </Box>
          <Stack spacing={3}>
            {resumeData.workHistory.map((work, index) => (
              <Fade in={true} key={index}>
                <Box
                  sx={{
                    p: 2,
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                    position: "relative",
                  }}
                >
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleRemoveItem("workHistory", index)}
                    sx={{ position: "absolute", top: 8, right: 8, minWidth: "auto" }}
                  >
                    ✕
                  </Button>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Company"
                        value={work.company || ""}
                        onChange={(e) =>
                          handleInputChange(e, "workHistory", index, "company")
                        }
                        fullWidth
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Position"
                        value={work.position || ""}
                        onChange={(e) =>
                          handleInputChange(e, "workHistory", index, "position")
                        }
                        fullWidth
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Duration"
                        value={work.date || ""}
                        onChange={(e) =>
                          handleInputChange(e, "workHistory", index, "date")
                        }
                        fullWidth
                        size="small"
                        placeholder="e.g. 2019-Present"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Note"
                        value={work.note || ""}
                        onChange={(e) =>
                          handleInputChange(e, "workHistory", index, "note")
                        }
                        fullWidth
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Description"
                        value={work.description || ""}
                        onChange={(e) =>
                          handleInputChange(e, "workHistory", index, "description")
                        }
                        fullWidth
                        multiline
                        rows={2}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Fade>
            ))}
            {resumeData.workHistory.length === 0 && (
              <Typography variant="body2" color="text.secondary" align="center">
                No work history added yet.
              </Typography>
            )}
          </Stack>
        </SectionPaper>

        {/* Skills Section */}
        <SectionPaper elevation={3}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Typography variant="h5" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              ⭐ Skills
            </Typography>
            <Button variant="text" onClick={() => handleAddItem("skills")}>
              + Add Skill
            </Button>
          </Box>
          <Grid container spacing={2}>
            {resumeData.skills.map((skill, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Fade in={true}>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                      p: 1,
                      border: "1px solid #eee",
                      borderRadius: 1,
                    }}
                  >
                    <TextField
                      label="Skill Name"
                      value={skill.skill || ""}
                      onChange={(e) =>
                        handleInputChange(e, "skills", index, "skill")
                      }
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label="%"
                      value={skill.ratingPercentage || ""}
                      onChange={(e) =>
                        handleInputChange(e, "skills", index, "ratingPercentage")
                      }
                      sx={{ width: 80 }}
                      size="small"
                      type="number"
                    />
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleRemoveItem("skills", index)}
                      sx={{ minWidth: "auto" }}
                    >
                      ✕
                    </Button>
                  </Box>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </SectionPaper>

        {/* Projects Section */}
        <SectionPaper elevation={3}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Typography variant="h5" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              🚀 Projects
            </Typography>
            <Button variant="text" onClick={() => handleAddItem("projectDetails")}>
              + Add Project
            </Button>
          </Box>
          <Stack spacing={3}>
            {resumeData.projectDetails.map((project, index) => (
              <Fade in={true} key={index}>
                <Box
                  sx={{
                    p: 2,
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                    position: "relative",
                  }}
                >
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleRemoveItem("projectDetails", index)}
                    sx={{ position: "absolute", top: 8, right: 8, minWidth: "auto" }}
                  >
                    ✕
                  </Button>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={8}>
                      <TextField
                        label="Project Title"
                        value={project.title || ""}
                        onChange={(e) =>
                          handleInputChange(e, "projectDetails", index, "title")
                        }
                        fullWidth
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Duration"
                        value={project.duration || ""}
                        onChange={(e) =>
                          handleInputChange(e, "projectDetails", index, "duration")
                        }
                        fullWidth
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Tech Stack"
                        value={project.subHeading || ""}
                        onChange={(e) =>
                          handleInputChange(e, "projectDetails", index, "subHeading")
                        }
                        fullWidth
                        size="small"
                        placeholder="e.g. React, Node.js, MongoDB"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Description"
                        value={project.description || ""}
                        onChange={(e) =>
                          handleInputChange(e, "projectDetails", index, "description")
                        }
                        fullWidth
                        multiline
                        rows={2}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Fade>
            ))}
          </Stack>
        </SectionPaper>

        {/* Interests Section */}
        <SectionPaper elevation={3}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Typography variant="h5" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              ❤️ Interests
            </Typography>
            <Button variant="text" onClick={() => handleAddItem("interestsDetails")}>
              + Add Interest
            </Button>
          </Box>
          <Stack spacing={2}>
            {resumeData.interestsDetails.map((interest, index) => (
              <Fade in={true} key={index}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "flex-start",
                  }}
                >
                  <TextField
                    label="Interest"
                    value={interest.heading || ""}
                    onChange={(e) =>
                      handleInputChange(e, "interestsDetails", index, "heading")
                    }
                    sx={{ width: "30%" }}
                    size="small"
                  />
                  <TextField
                    label="Description"
                    value={interest.description || ""}
                    onChange={(e) =>
                      handleInputChange(e, "interestsDetails", index, "description")
                    }
                    fullWidth
                    size="small"
                  />
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleRemoveItem("interestsDetails", index)}
                    sx={{ minWidth: "auto", mt: 1 }}
                  >
                    ✕
                  </Button>
                </Box>
              </Fade>
            ))}
          </Stack>
        </SectionPaper>

        {/* Submit Section */}
        <Box sx={{ textAlign: "center", pb: 8 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              px: 6,
              py: 1.5,
              fontSize: "1.1rem",
              borderRadius: "50px",
              boxShadow: "0 8px 16px rgba(25, 118, 210, 0.24)",
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Save Resume Data"
            )}
          </Button>

          {success && (
            <Alert severity="success" sx={{ mt: 3, maxWidth: 400, mx: "auto" }}>
              Form submitted successfully!
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mt: 3, maxWidth: 400, mx: "auto" }}>
              Form submission failed. Please try again.
            </Alert>
          )}
        </Box>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="warning"
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Fade>
  );
};

export default ResumeForm;

