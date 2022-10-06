<!--
Copyright 2022 SpinalCom - www.spinalcom.com

This file is part of SpinalCore.

Please read all of the following terms and conditions
of the Free Software license Agreement ("Agreement")
carefully.

This Agreement is a legally binding contract between
the Licensee (as defined below) and SpinalCom that
sets forth the terms and conditions that govern your
use of the Program. By installing and/or using the
Program, you agree to abide by all the terms and
conditions stated or referenced herein.

If you do not agree to abide by these terms and
conditions, do not demonstrate your acceptance and do
not install or use the Program.
You should have received a copy of the license along
with this file. If not, see
<http://resources.spinalcom.com/licenses.pdf>.
-->

<template>
  <v-container class="container"
               fluid>
    <div class="header">
      <v-card class="btnCard">

        <v-btn class="button"
               @click="uploadApiFile"
               color="#14202c">
          <v-icon class="btnIcon">
            mdi-file-upload
          </v-icon>

          Upload Swagger File
        </v-btn>
      </v-card>
    </div>

    <v-card class="tableCard">
      <div class="toolbar">
        <div class="_title">liste des apis </div>
        <div class="searchDiv">
          <v-text-field solo
                        prepend-inner-icon="mdi-magnify"
                        flat
                        label="rechercher"
                        hide-details="auto"
                        v-model.trim="searchQuery"></v-text-field>
        </div>
      </div>
      <v-divider></v-divider>

      <div class="table-container">
        <table-component :items="searchedData"
                         :headers="headers"></table-component>
      </div>

    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import TableComponent from "./tableComponent.vue";
import { Getter, Action } from "vuex-class";
import Fuse from "fuse.js";

@Component({
  components: {
    TableComponent,
  },
})
export default class HomeComponent extends Vue {
  searchedData: any[] = [];
  fuseSearch: any;
  searchQuery: string = "";
  debounce: any = undefined;

  headers = [
    { text: "Nom", value: "name" },
    { text: "Scope", value: "scope" },
    { text: "Methodes", value: "method" },
  ];

  @Getter apis!: any[];

  @Action createApiRoute!: any;
  @Action updateApiRoute!: any;
  @Action getAllApiRoute!: any;
  @Action deleteApiRoute!: any;
  @Action uploadSwaggerFile!: any;

  async mounted() {
    await this.getAllApiRoute();

    // this.fuseSearch = new Fuse(Object.assign([], this.apis), {
    //   isCaseSensitive: false,
    //   keys: ["name", "children.route"],
    // });
    this.searchedData = Object.assign([], this.apis);
  }

  uploadApiFile() {
    const maxSize = 25000000;
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = false;
    input.click();
    input.addEventListener(
      "change",
      (event: any) => {
        const [file] = event.target.files;

        if (file.size >= maxSize) {
          alert(
            "The selected file is too large. The maximum size must not exceed 25 MB"
          );
          return;
        }

        if (!/.*\.json$/.test(file.name)) {
          alert("The selected file must be a json file");
          return;
        }

        var formData = new FormData();
        formData.append("file", file);
        this.uploadSwaggerFile(formData);

        // const reader = new FileReader();

        // reader.onload = (res) => {
        //   const data = this.parseSwaggerJson(JSON.parse(res.target.result));
        //   this.uploadDialogData.requests = data;
        //   this.uploadDialogData.show = true;
        // };
        // reader.onerror = (err) => console.log(err);
        // reader.readAsText(file);
      },
      false
    );
  }

  @Watch("searchQuery")
  watchSearchText(value: string) {
    clearTimeout(this.debounce);
    this.debounce = setTimeout(() => {
      if (value.trim().length === 0) {
        this.searchedData = Object.assign([], this.apis);
      } else {
        this.searchedData = this.filterApisData(value);
      }
      // console.log(this.fuseSearch.search(value.trim().toLocaleLowerCase()));
    }, 400);
  }

  filterApisData(value: string) {
    return this.apis.reduce((liste: any, item: any) => {
      const temp = Object.assign({}, item);
      temp.children = item.children.filter((el: any) =>
        el.route.toLocaleLowerCase().includes(value.toLocaleLowerCase())
      );

      if (temp.children.length > 0) liste.push(temp);
      return liste;
    }, []);
  }
}
</script>

<style lang="scss">
$header-height: 60px;
$page-background: #f5f3f3;
$toolbar-height: 120px;

.container {
  width: 100vw;
  height: 100vh;
  background-color: #e5edef;
  $header-margin-bottom: 10px;

  .header {
    width: 100%;
    height: $header-height;
    margin-bottom: $header-margin-bottom;
    display: flex;
    justify-content: flex-end;

    .btnCard {
      min-width: 250px;
      height: $header-height;
      border-radius: 7px;
      padding: 10px;
      background-color: $page-background !important;
      display: flex;
      justify-content: center;
      align-items: center;

      .button {
        height: 100%;
        color: #fff;

        .btnIcon {
          margin-right: 5px;
        }
      }
    }
  }

  .tableCard {
    padding: 10px;
    background-color: $page-background !important;
    width: 100%;
    height: calc(100% - #{$header-height + $header-margin-bottom});
    border-radius: 10px;

    .toolbar {
      width: 100%;
      height: $toolbar-height !important;
      display: flex;
      flex-direction: column;
      justify-content: space-around;

      ._title {
        text-transform: uppercase;
      }
    }

    .table-container {
      height: calc(100% - #{$toolbar-height}) !important;
    }
  }
}
</style>