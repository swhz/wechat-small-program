const url = 'http://m.maoyan.com'
const url1 = 'http://platform.mobile.meituan.com/open/maoyan'
module.exports = {
    apiList: {
        //获取上映电影列表
        movies:url+'/movie/list.json',
        //获取城市列表
        cityList:url1+'/v1/cities.json',
        //获取指定城市电影院信息，示例：http://platform.mobile.meituan.com/open/maoyan/v1/cinemas.json?ct=武汉
        cityCinemas:url1+'/v1/cinemas.json?ct=',
        //根据ip段加载出本地的影院
        cinemas:url+'/cinemas.json',
        //获取指定电影院(cinemaid)信息，示例：http://m.maoyan.com/showtime/wrap.json?cinemaid=896
        cinema:url+'/showtime/wrap.json?cinemaid=',
        //获取指定电影院(cinemaid)信息(plan B)，
        //示例：http://platform.mobile.meituan.com/open/maoyan/v1/cinema/896/movies/shows.json
        cinemaB:url1+'/v1/cinema/'
    }
}