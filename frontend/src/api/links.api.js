import requests from './http.api'

const linkServices = {
  getMyLinks() {
    return requests.get('/api/v1/my-links')
  },

  deleteLink(shortId) {
    return requests.delete(`/api/v1/delete/${shortId}`)
  },

  updateLink(shortId, newShortId) {
    return requests.patch(`/api/v1/update/${shortId}`, { newShortId })
  },

  createLink(originalUrl) {
    return requests.post('/api/v1/shorten', { originalUrl })
  },

  createLinkPublic(originalUrl) {
    return requests.post('/api/v1/public/shorten', { originalUrl })
  },
}

export default linkServices
