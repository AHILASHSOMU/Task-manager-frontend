import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers";
import { Grid } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import PropTypes from "prop-types";
import Slider, { SliderThumb } from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { format } from "date-fns";
import moment from "moment";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import axios from "../ApiCalls/axios";

function TaskManager() {
  const userLogin = useSelector((state) => state.user);
  const { token, userData } = userLogin;

  const userId = userData.id;

  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [progress, setProgress] = useState("");
  const [taskAdded, setTaskAdded] = useState(false);
  const [updatedSuccess, setUpdatedSuccess] = useState(false);
  const [deletedSuccess, setDeletedSuccess] = useState(false);
  const [remSetSuccess,setremSetSuccess] = useState(false);

  const [tasks, setTasks] = useState([]);

  const handleDateRangeChange = (newValue) => {
    setStartDate(newValue[0]);
    setEndDate(newValue[1]);
  };

  function ValueLabelComponent(props) {
    const { children, value } = props;

    return (
      <Tooltip enterTouchDelay={0} placement="top" title={value}>
        {children}
      </Tooltip>
    );
  }

  ValueLabelComponent.propTypes = {
    children: PropTypes.element.isRequired,
    value: PropTypes.number.isRequired,
  };

  const [open, setOpen] = React.useState(false);
  const [Upopen, setUpOpen] = React.useState(false);
  const [Remopen, setRemOpen] = React.useState(false);
  const theme = useTheme();
  const theme1 = useTheme();
  const theme2 = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const UpfullScreen = useMediaQuery(theme1.breakpoints.down("md"));
  const RemfullScreen = useMediaQuery(theme2.breakpoints.down("md"));

  const handleClickOpen = () => {
    resetHandler();
    setOpen(true);
  };

  const [upTitle, setUpTitle] = useState("");
  const [upDescription, setUpDescription] = useState("");
  const [upStartDate, setUpStartDate] = useState("");
  const [upEndDate, setUpEndDate] = useState("");
  const [upProgress, setUpProgress] = useState("");
  const [id, setId] = useState("");

  const handleUpdate = (id) => {
    console.log(id);
    const task = tasks.find((task) => task.id === id);
    console.log("task", task);
    if (task) {
      setUpTitle(task.title);
      setUpDescription(task.description);
      // setUpStartDate(task.startDate);
      // setUpEndDate(task.endDate);
      setUpProgress(task.progress);
      setId(id);
      console.log("date", upStartDate);
      setUpOpen(true);
    }
  };

  const handleUpClose = () => {
    setUpOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const resetHandler = () => {
    setTitle("");
    setDescription("");
    setStartDate("");
    setEndDate("");
  };

  const deleteTask = async (id) => {
    console.log(id, "del");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const deleted = await axios.get(`/user/deleteTask/${id}`, config);
    console.log(deleted);
    if (deleted.data.message) {
      setDeletedSuccess(!deletedSuccess);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      userId: userData.id,
      title,
      description,
      startDate,
      endDate,
    };
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    console.log("front", token);
    const response = await axios.post(`/user/addTask`, data, config);
    console.log(response);
    if (response.data) {
      resetHandler();
      handleClose();
      setTaskAdded(!taskAdded);
    }
  };

  const handleUpdateSubmit = async (event) => {
    event.preventDefault();

    const data = {
      id,
      upTitle,
      upDescription,
      upProgress,
      upStartDate,
      upEndDate,
    };

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const updated = await axios.post(`/user/updateTask`, data, config);
    console.log(updated);
    if (updated.data.message) {
      setUpdatedSuccess(!updatedSuccess);
      handleUpClose();
      resetHandler();
    }
  };

  //Remainder
  const pendingTasks = tasks.filter((task) => !task.status);
  const [remainder, onChange] = useState(new Date());

  const openReminder = (id) => {
    console.log("rem", id);
    setId(id);
    setRemOpen(true);
  };

  const handleRemClose = () => {
    setRemOpen(false);
  };

  const setReminder = async (e) => {
    e.preventDefault();

    console.log("came to setreminder");
    const taskData = { remainder };
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const remainderSet = await axios.post(
      `/user/setRemainder/${id}`,
      taskData,
      config
    );

    console.log("front", remainderSet);
    if(remainderSet.data.message){
      setremSetSuccess(!remSetSuccess)
    }

    handleRemClose();
  };

  function TaskList({ tasks }) {
    useEffect(() => {
      const intervalId = setInterval(() => {
        checkReminders();
      }, 20000); // check reminders every minute

      return () => clearInterval(intervalId); // clear interval on unmounting the component
    }, []); // run the effect only on component mounting

    const checkReminders = () => {
      const now = moment();
      tasks.forEach((task) => {
        console.log("foreach", task.setRemainder);
        const remainderDateTime = moment.utc(task.setRemainder);
        console.log(remainderDateTime);
        if (remainderDateTime.isSame(now, "minute")) {
          console.log("working");
          toast.error(`Remainder for task "${task.title}"`);
        }
      });
    };
  }

  useEffect(() => {
    getAllTasks();
  }, [taskAdded, updatedSuccess, deletedSuccess,remSetSuccess]);

  async function getAllTasks() {
    const userId = userData.id;
    console.log("came", token);

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.get(
      `/user/getAllTasks?userId=${userId}`,
      config
    );
    console.log(response);
    if (response.data) {
      setTasks(response.data);
    }
  }

  return (
    <div>
      <Box>
        <Toaster toasterOptions={{ duratiom: 8000 }} />
      </Box>
      <Box
        maxWidth
        sx={{
          bgcolor: "#E9E8E8",
          marginTop: "20px",
        }}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <TaskList tasks={tasks} />
        <Typography
          variant="h5"
          fontWeight={{ xs: 200, sm: 200, md: 200, lg: 200 }}
          my={{ xs: 0.5, sm: 1, md: 1.6, lg: 2 }}
          sx={{
            fontFamily: "Inria Serif",
            color: "primary.main",
          }}
        >
          Your Scoreboard [Completed - {tasks.length - pendingTasks.length} ,
          Pending - {pendingTasks.length}, Total - {tasks.length}]
        </Typography>
      </Box>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        style={{ marginTop: "20px" }}
      >
        <Button variant="contained" color="success" onClick={handleClickOpen}>
          Add Your Task
        </Button>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            {"Task Details"}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  id="title"
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  type="text"
                  fullWidth
                />
                <TextField
                  margin="dense"
                  id="description"
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  type="text"
                  fullWidth
                />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker"]}>
                        <DatePicker
                          value={startDate}
                          disablePast={true}
                          onChange={(newDate) => setStartDate(newDate)}
                          fullWidth
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker"]}>
                        <DatePicker
                          value={endDate}
                          disablePast={true}
                          onChange={(newDate) => setEndDate(newDate)}
                          fullWidth
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </Grid>
                </Grid>
              </DialogContentText>
            </DialogContent>

            <DialogActions>
              <Button autoFocus onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Submit
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>

      <Box>
        <Typography variant="h4" component="h1">
          Tasks:
        </Typography>
      </Box>
      <Box
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          backgroundColor: "lightgray",
        }}
      >
        {tasks.map((task) => (
          <Box style={{ margin: "10px", backgroundColor: "lightgray" }}>
            <Card sx={{ maxWidth: 345 }}>
              <CardActionArea>
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    style={{ textAlign: "center" }}
                  >
                    {task.title}
                  </Typography>
                  <Box
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                  >
                    <Box style={{ marginRightt: "10px" }}>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        style={{ marginBottom: "8px", fontWeight: "bold" }}
                      >
                        Description:
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        style={{ marginBottom: "8px", fontWeight: "bold" }}
                      >
                        Start Date:
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        style={{ marginBottom: "8px", fontWeight: "bold" }}
                      >
                        End Date:
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        style={{ marginBottom: "8px", fontWeight: "bold" }}
                      >
                        Progress:
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        style={{ marginBottom: "8px", fontWeight: "bold" }}
                      >
                        Remainder:
                      </Typography>
                    </Box>

                    <Box style={{ marginLeft: "10px" }}>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        style={{ marginBottom: "8px" }}
                      >
                        {task.description}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        style={{ marginBottom: "8px" }}
                      >
                        {format(new Date(task.startDate), "dd-MM-yyyy")}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        style={{ marginBottom: "8px" }}
                      >
                        {format(new Date(task.endDate), "dd-MM-yyyy")}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        style={{ marginBottom: "8px" }}
                      >
                        {task.progress} %
                      </Typography>

                      <Typography
                        variant="body1"
                        color="text.secondary"
                        style={{ marginBottom: "8px" }}
                      >
                        {task.setRemainder
                          ? format(
                              new Date(task.setRemainder),
                              "dd-MM-yyyy hh:mm:ss a"
                            )
                          : "Not yet set"}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                  >
                    <Box style={{ marginRight: "40px" }}>
                      <Button
                        onClick={() => {
                          handleUpdate(task.id);
                        }}
                        variant="contained"
                        color="primary"
                      >
                        Update
                      </Button>
                      <Dialog
                        fullScreen={UpfullScreen}
                        open={Upopen}
                        onClose={handleUpClose}
                        BackdropProps={{ invisible: true }}
                        aria-labelledby="responsive-dialog-title"
                      >
                        <DialogTitle id="responsive-dialog-title">
                          {"Update Task Details"}
                        </DialogTitle>
                        <form onSubmit={handleUpdateSubmit}>
                          <DialogContent>
                            <DialogContentText>
                              <TextField
                                autoFocus
                                margin="dense"
                                id="title"
                                label="Title"
                                defaultValue={upTitle}
                                onChange={(e) => setUpTitle(e.target.value)}
                                type="text"
                                fullWidth
                              />
                              <TextField
                                margin="dense"
                                id="description"
                                label="Description"
                                defaultValue={upDescription}
                                onChange={(e) =>
                                  setUpDescription(e.target.value)
                                }
                                type="text"
                                fullWidth
                              />
                              <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DemoContainer components={["DatePicker"]}>
                                      <DatePicker
                                        value={upStartDate}
                                        disablePast={true}
                                        onChange={(newDate) =>
                                          setUpStartDate(newDate)
                                        }
                                        fullWidth
                                      />
                                    </DemoContainer>
                                  </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DemoContainer components={["DatePicker"]}>
                                      <DatePicker
                                        value={upEndDate}
                                        disablePast={true}
                                        onChange={(newDate) =>
                                          setUpEndDate(newDate)
                                        }
                                        fullWidth
                                      />
                                    </DemoContainer>
                                  </LocalizationProvider>
                                </Grid>
                              </Grid>
                              <Typography gutterBottom>Progress</Typography>
                              <Slider
                                valueLabelDisplay="auto"
                                slots={{
                                  valueLabel: ValueLabelComponent,
                                }}
                                aria-label="custom thumb label"
                                onChange={(event, newValue) =>
                                  setUpProgress(newValue)
                                }
                                defaultValue={upProgress}
                              />
                            </DialogContentText>
                          </DialogContent>

                          <DialogActions>
                            <Button autoFocus onClick={handleUpClose}>
                              Cancel
                            </Button>
                            <Button type="submit" color="primary">
                              Confirm Update
                            </Button>
                          </DialogActions>
                        </form>
                      </Dialog>
                    </Box>

                    <Box>
                      <Button
                        onClick={() => deleteTask(task.id)}
                        variant="contained"
                        color="primary"
                      >
                        Delete
                      </Button>
                    </Box>
                  </Box>
                  <Box display="flex" justifyContent="center" marginTop={2}>
                    <Button
                      onClick={() => openReminder(task.id)}
                      variant="contained"
                      color="primary"
                    >
                      Reminder
                    </Button>
                    <Dialog
                      fullScreen={RemfullScreen}
                      open={Remopen}
                      onClose={handleRemClose}
                      BackdropProps={{ invisible: true }}
                      aria-labelledby="responsive-dialog-title"
                    >
                      <DialogTitle id="responsive-dialog-title">
                        {"Update Task Details"}
                      </DialogTitle>
                      <form onSubmit={setReminder}>
                        <DialogContent sx={{ minHeight: "20vw" }}>
                          <DateTimePicker
                            onChange={onChange}
                            value={remainder}
                          />
                        </DialogContent>

                        <DialogActions>
                          <Button autoFocus onClick={handleRemClose}>
                            Cancel
                          </Button>
                          <Button type="submit" color="primary">
                            Set Reminder
                          </Button>
                        </DialogActions>
                      </form>
                    </Dialog>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Box>
        ))}
      </Box>
    </div>
  );
}

export default TaskManager;
