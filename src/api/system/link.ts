import request from '@/utils/request';
import axios from 'axios';
// 查询参数列表分页
export function listApi(query: any) {
    return request({
        url: '/link/list',
        method: 'get',
        params: query
    })
}

// 查询参数列表
export function listApiAll(query: any) {
    return request({
        url: '/link/list/?page=1&pageSize=999&enable_datasource=0',
        method: 'get',
        params: query
    })
}

// 查询参数详细
export function getApi(id: any) {
    return request({
        url: '/link/list/' + id + '/',
        method: 'get'
    })
}

// 新增参数配置
export function addApi(data: any) {
    return request({
        url: '/link/list/',
        method: 'post',
        data: data
    })
}

// 修改参数配置
export function updateApi(data: any) {
    return request({
        url: '/link/list/' + data.id + '/',
        method: 'put',
        data: data
    })
}

// 删除参数配置
export function delApi(id: any) {
    return request({
        url: '/link/list/' + id + '/',
        method: 'delete'
    })
}

// 获取权限Api通过角色id
export function getPolicyPathByRoleId(id: any) {
    return request({
        url: '/system/role/role-id-to-menu/' + id + '/',
        method: 'get'
    })
}

// 获取所有的API组
export function getApiGroup() {
    return request({
        url: '/link/list/get-all-api-group/',
        method: 'get',
    })
}
export const uploadSingleFile = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  return request({
    url: '/api/upload/',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': undefined }
  })
}
export const uploadMultipleFiles = (files: File[]) => {
  const formData = new FormData()
  files.forEach(file => {
    formData.append('files', file) // 注意字段名是 'files'
  })

  return request({
    url: '/api/upload/multiple/',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': undefined }
  })
}