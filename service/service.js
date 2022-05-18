import axios from "axios";
import { config } from '../config';
import Interceptor from '../interceptor';

export default {
    /**
     * banner images
     */
    bannerImage: () => {
        // console.log('before axios');
        return axios.get(config.baseApiUrl + 'api/list/banner-list')
            .then(response => {
                // console.log('inside axios');
                // console.log(response);
                return response
            })
            .catch({ status: 500, message: 'Internal Serevr Error' })
    },

    /**
     * fearure product
     */
    getFeatureProduct: () => {
        return axios.get(config.baseApiUrl + 'api/product-store/featureproduct-list')
            .then(response => {
                // console.log('inside axios');
                // console.log(response);
                return response
            })
            .catch({ status: 500, message: 'Internal Serevr Error' })
    },

    /**
     * category list
     */
    getCategoryList: () => {
        return axios.get(config.baseApiUrl + 'api/list/category-list')
            .then(response => {
                // console.log('inside axios');
                // console.log(response);
                return response
            })
            .catch({ status: 500, message: 'Internal Serevr Error' })
    },

    /**
     * @param {JSON} state data
     * login
     */
    loginData: (stateData) => {
        return axios.post(config.baseApiUrl + 'api/customer/login', stateData)
            .then(response => {
                // console.log('inside axios');
                // console.log(response);
                return response
            })
            .catch({ status: 500, message: 'Internal Serevr Error' })
    },

    /**
     * @param {JSON} state data
     * sign up
     */
    signUpData: (stateData) => {
        return axios.post(config.baseApiUrl + 'api/customer/register', stateData)
            .then(response => {
                // console.log('inside axios');
                // console.log(response);
                return response
            })
            .catch({ status: 500, message: 'Internal Serevr Error' })
    },

    /**
     * @param {JSON} productId
     * get product detail
     */
    getProductData: (productId) => {
        console.log('productId-=-=', productId);
        return axios.get(config.baseApiUrl + 'api/product-store/productdetail/' + productId)
            .then(response => {
                // console.log('inside axios');
                // console.log(response);
                return response
            })
            .catch({ status: 500, message: 'Internal Serevr Error' })
    },

    /**
     * @param {JSON} productId
     * get related product detail
     */
    getRelatedProductData: (productId) => {
        console.log('productId-=-=', productId);
        return axios.get(config.baseApiUrl + 'api/list/related-product-list?productId=' + productId)
            .then(response => {
                // console.log('inside axios');
                // console.log(response);
                return response
            })
            .catch({ status: 500, message: 'Internal Serevr Error' })
    },

    /**
     * @param {JSON} productId
     * add product to wishlist
     */
    addProductToWishlist: (obj) => {
        console.log('productId-=-=', obj);
        return axios.post(config.baseApiUrl + 'api/customer/add-product-to-wishlist', obj)
            .then(response => {
                // console.log('inside axios');
                // console.log(response);
                return response
            })
            .catch({ status: 500, message: 'Internal Serevr Error' })
    },

    /**
     * get wishlist data
     */
    getWishListData: () => {
        return axios.get(config.baseApiUrl + 'api/customer/wishlist-product-list')
            .then(response => {
                // console.log('inside axios');
                // console.log(response);
                return response
            })
            .catch({ status: 500, message: 'Internal Serevr Error' })
    },

    /**
     * @param {*} product id
     * delete product from wishlist
     */
    deleteProductWishList: (pid) => {
        return axios.delete(config.baseApiUrl + 'api/customer/wishlist-product-delete/' + pid)
            .then(response => {
                // console.log('inside axios');
                // console.log(response);
                return response
            })
            .catch({ status: 500, message: 'Internal Serevr Error' })
    },

    /**
     * @param {JSON} emailId
     * forgot password
     */
    forgotPaswd: (obj) => {
        // console.log('obj in service-=-=', obj);
        return axios.post(config.baseApiUrl + 'api/customer/forgot-password', obj)
            .then(response => {
                // console.log('inside axios');
                // console.log(response);
                return response
            })
            .catch({ status: 500, message: 'Internal Serevr Error' })
    },

    /**
     * @param {*} keyword
     * search product
     */
    searchProductData: (keyword) => {
        return axios.get(config.baseApiUrl + 'api/list/productlist?keyword=' + keyword)
            .then(response => {
                // console.log('inside axios');
                // console.log(response);
                return response
            })
            .catch({ status: 500, message: 'Internal Serevr Error' })
    },

    /**
     * get user profile
     */
    getProfileData: () => {
        return axios.get(config.baseApiUrl + 'api/customer/get-profile')
            .then(response => {
                // console.log('inside axios');
                // console.log(response);
                return response
            })
            .catch({ status: 500, message: 'Internal Serevr Error' })
    },

    /**
     * @param {JSON} userDetail
     * update user profile
     */
    updateProfileData: (obj) => {
        console.log('obj in update profile======', obj);
        return axios.post(config.baseApiUrl + 'api/customer/edit-profile', obj)
            .then(response => {
                // console.log('inside axios');
                // console.log(response);
                return response
            })
            .catch({ status: 500, message: 'Internal Serevr Error' })
    },

    /**
     * get country list
     */
    getCountryListData: () => {
        return axios.get(config.baseApiUrl + 'api/list/country-list')
            .then(response => {
                // console.log('inside axios');
                // console.log(response);
                return response
            })
            .catch({ status: 500, message: 'Internal Serevr Error' })
    },

    /**
     * get zone list
     */
    getZoneListData: () => {
        return axios.get(config.baseApiUrl + 'api/list/zone-list')
            .then(response => {
                // console.log('inside axios');
                // console.log(response);
                return response
            })
            .catch({ status: 500, message: 'Internal Serevr Error' })
    },

    /**
     * @param {JSON} cart data
     * checkout
     */
    checkOutData: (obj) => {
        return axios.post(config.baseApiUrl + 'api/orders/customer-checkout', obj)
            .then(response => {
                // console.log('inside axios');
                // console.log(response);
                return response
            })
            .catch({ status: 500, message: 'Internal Serevr Error' })
    },

    /**
     * @param {JSON} old and new password
     * update password
     */
    updatePassword: (obj) => {
        return axios.post(config.baseApiUrl + 'api/customer/change-password', obj)
            .then(response => {
                // console.log('inside axios');
                // console.log(response);
                return response
            })
            .catch({ status: 500, message: 'Internal Serevr Error' })
    },

    /**
     * @param {JSON} Address
     * save address
     */
    saveAddressData: (obj) => {
        return axios.post(config.baseApiUrl + 'api/address/add-address', obj)
            .then(response => {
                // console.log('inside axios');
                // console.log(response);
                return response
            })
            .catch({ status: 500, message: 'Internal Serevr Error' })
    },

    /**
     * @param {*} customerId
     * get address
     */
    getAddressData: (id) => {
        return axios.get(config.baseApiUrl + 'api/address/get-address-list/' + id)
            .then(response => {
                // console.log('inside axios');
                // console.log(response);
                return response
            })
            .catch({ status: 500, message: 'Internal Serevr Error' })
    },

    /**
     * @param {JSON} address
     * update address
     */
    updateAddressData: (obj) => {
        return axios.put(config.baseApiUrl + 'api/address/update-address/' + obj.addressId, obj)
            .then(response => {
                // console.log('inside axios');
                // console.log(response);
                return response
            })
            .catch({ status: 500, message: 'Internal Serevr Error' })
    },

    /**
     * @param {JSON} addressId
     * delete address
     */
    deleteAddress: (addressId) => {
        return axios.delete(config.baseApiUrl + 'api/address/delete-address/' + addressId)
            .then(response => {
                // console.log('inside axios');
                // console.log(response);
                return response
            })
            .catch({ status: 500, message: 'Internal Serevr Error' })
    },

    /**
     * get order history
     */
    getOrderHistoryData: () => {
        return axios.get(config.baseApiUrl + 'api/orders/order-list')
            .then(response => {
                // console.log('inside axios');
                // console.log(response);
                return response
            })
            .catch({ status: 500, message: 'Internal Serevr Error' })
    },

    /**
     * @param {JSON} obj
     * get order detail
     */
    getOrderDetailData: (obj) => {
        return axios.get(config.baseApiUrl + 'api/orders/order-detail?orderId=' + obj)
            .then(response => {
                // console.log('inside axios');
                // console.log(response);
                return response
            })
            .catch({ status: 500, message: 'Internal Serevr Error' })
    },

    /**
     * contact us
     */
    contactUsData: (obj) => {
        return axios.post(config.baseApiUrl + 'api/list/contact-us', obj)
            .then(response => {
                // console.log('inside axios');
                // console.log(response);
                return response
            })
            .catch({ status: 500, message: 'Internal Serevr Error' })
    },

    /**
     * @param {JSON} categoryId
     * get category detail
     */
    getCategoryDetailData: (categoryId) => {
        return axios.get(config.baseApiUrl + 'api/list/productlist?categoryId='+ categoryId)
            .then(response => {
                // console.log('inside axios');
                // console.log(response);
                return response
            })
            .catch({ status: 500, message: 'Internal Serevr Error' })
    }
}