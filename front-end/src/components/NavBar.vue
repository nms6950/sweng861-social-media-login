<template>
    <div class="sidebar">
        <a href="#/home" class="active">
            <fa icon="home" />
            <b class="ms-2">Home</b>
        </a>
        <a href="#">
            <fa icon="right-from-bracket" />
            <b class="ms-2">Logout</b>
        </a>
    </div>
</template>

<style>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 220px;
  background-color: #333;
  color: #fff;
  display: flex;
  flex-direction: column;
  padding-top: 20px;
}

.active {
    background-color: #222;
}


.sidebar a {
  padding: 15px 20px;
  text-decoration: none;
  color: white;
  transition: background 0.3s;
}

.sidebar a:hover {
  background-color: #444;
}
</style>

<script>
export default {
    name: 'NavBar',
    data() {
        return {

        }
    },
}
</script>