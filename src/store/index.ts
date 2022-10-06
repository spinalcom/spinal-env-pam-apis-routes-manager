/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
 * 
 * This file is part of SpinalCore.
 * 
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 * 
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 * 
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)



/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
 * 
 * This file is part of SpinalCore.
 * 
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 * 
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 * 
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

import {
  createApiRouteRequest,
  updateApiRouteRequest,
  getApiRouteByIdRequest,
  getAllApiRouteRequest,
  deleteApiRouteRequest,
  uploadFile
} from "../requests/apisListRequest";

export const CREATE_API_ROUTE = "CREATE_API_ROUTE";
export const UPDATE_API_ROUTE = "UPDATE_API_ROUTE";
export const GET_API_ROUTE = "GET_API_ROUTE";
export const GET_ALL_API_ROUTE = "GET_ALL_API_ROUTE";
export const DELETE_API_ROUTE = "DELETE_API_ROUTE";

export default new Vuex.Store({
  state: () => ({ apis: [] }),
  mutations: {
    [CREATE_API_ROUTE](state: any, playload: any) {
      state.apis = [playload, ...state.apis];
    },

    [UPDATE_API_ROUTE](state: any, playload: any) {
      const copy = Object.assign([], state.apis);
      const index = copy.findIndex((el: any) => el.id === playload.id);
      if (index !== -1) {
        copy[index] = playload;
        state.apis = copy;
      }
    },

    [GET_ALL_API_ROUTE](state: any, playload: any) {
      state.apis = playload.reduce((liste: any[], item: any) => {
        let found = liste.find(el => el.name === item.tag);

        if (found) {
          found.children.push(item);
          return liste;
        }

        liste.push({
          name: item.tag,
          children: [item]
        })

        return liste;
      }, []);
    },

    [DELETE_API_ROUTE](state: any, playload: any) {
      state.apis = state.apis.filter((el: any) => el.id !== playload);
    }
  },
  actions: {
    async createApiRoute({ commit }: any, data: any) {
      const response = await createApiRouteRequest(data);
      commit(CREATE_API_ROUTE, response.data);
    },

    async updateApiRoute({ commit }: any, { id, data }: any) {
      const response = await updateApiRouteRequest(id, data);
      commit(UPDATE_API_ROUTE, response.data);
    },

    async getApiRoute({ commit }: any, id: any) {
      const response = await getApiRouteByIdRequest(id);
      commit(GET_API_ROUTE, response.data);
    },

    async getAllApiRoute({ commit }: any) {
      const response = await getAllApiRouteRequest();
      commit(GET_ALL_API_ROUTE, response.data);
    },

    async deleteApiRoute({ commit }: any, id: any) {
      await deleteApiRouteRequest(id);
      commit(DELETE_API_ROUTE, id);
    },

    async uploadSwaggerFile({ commit }, fileData: any) {
      const response = await uploadFile(fileData);
      commit(GET_ALL_API_ROUTE, response.data);

    }
  },

  getters: {
    apis({ apis }) {
      return apis;
    }
  }
});
