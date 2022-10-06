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
import axios from "axios";
const baseURL = "http://localhost:8065/api/v1/pam";

const HTTP = axios.create({ baseURL });

export function createApiRouteRequest(data: any) {
    return HTTP.post(`/create_api_route`, data);
}

export function updateApiRouteRequest(id: string, newData: any) {
    return HTTP.put(`/update_api_route/${id}`, newData);
}

export function getApiRouteByIdRequest(id: string) {
    return HTTP.get(`/get_api_route/${id}`);
}

export function getAllApiRouteRequest() {
    return HTTP.get(`/get_all_api_route`);
}

export function deleteApiRouteRequest(id: string) {
    return HTTP.delete(`/delete_api_route/${id}`);
}

export function uploadFile(fileData: any) {
    return HTTP.post(`/upload_apis_routes`, fileData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}
