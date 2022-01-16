+$(function(){
    // 参数配置
    // 可以手动修改
    //==================页面数据表格id=======================
    //一般不需要更改
    const unicourID = "#unicour"
    const othcourID = "#othcour"
    const panknowupID = "#panknowup"
    const booksID = "#books"
    const noticeID = "#notice"
    const showDataContainerID = "#bd-show-data";
    const noticePageID = "#noticePgae"
    const startPageID = "#startPgae"
    const aboutPageID = "#aboutPage"
    const commPageID = "#commPage"
    const searchButtID = "#search"
    const filterID = "#filter"
    //==================页面数据源，结构是固定的================
    //直接用word打开编辑
    const unicourDataPath = "data/unicour_data.csv"
    const othcourDataPath = "data/othcour_data.csv"
    const panknowDataPath = "data/panknowup_data.csv"
    const booksDataPath = "data/books_data.csv"
    const noticePath = "data/notice.dat"
    const startPagePath = "data/startPgae.dat"
    const aboutPagePath = "data/aboutPage.dat"

    const noticePage = 0
    const startPage = 1
    const aboutPage = 2
    const unicourPage = 3
    const othcourPage = 4
    const panknowPage = 5
    const booksPage = 6
    const commPage = 7

    const pageDataSum = 8   // 默认一页显示几条数据

    pageStateItems = [noticePageState, startPageState, aboutPageState, showDataPageState, commPageState]

    leftMeunItems = [
        {
            index: noticePage,
            url: noticePath,
            data: '正在加载公告...',
            id: noticePageID
        },
        {
            index: startPage,
            url: startPagePath,
            data: '',
            id : startPageID
        },
        {
            index: aboutPage,
            url: aboutPagePath,
            data: '',
            id : aboutPageID
        },
        {
            index: unicourPage,
            url:unicourDataPath,
            id:unicourID,
            data:[],
            searchData:[],
            isInit:false,
            curr_page:0,
            step:1,
            callback: initUnicour
        },
        {
            index: othcourPage,
            url:othcourDataPath,
            id:othcourID,
            data:[],
            searchData:[],
            isInit:false,
            curr_page:0,
            step:1,
            callback: initOthcour
        },
        {
            index: panknowPage,
            url:panknowDataPath,
            id:panknowupID,
            data:[],
            searchData:[],
            isInit:false,
            curr_page:0,
            step:1,
            callback: initPanknowup
        },
        {
            index: booksPage,
            url:booksDataPath,
            id:booksID,
            data:[],
            searchData:[],
            isInit:false,
            curr_page:0,
            step:1,
            callback: initBooks
        },
        {
            index: commPage,
            url: '',
            data: '',
            id: commPageID
        }
    ]

    $('button.navbar-toggler').click(function(){
        $('button.navbar-toggler span').toggleClass('active')
    });

    $(searchButtID).click(function() {
        const key = 1
        const filter = $(filterID).val()
        const index = $('a.nav-link').index($('a.nav-link.active'))
        if (unicourPage <= index && index <= booksPage) {
            // 只有在对应页面上才能搜索
            const item = leftMeunItems[index]
            item.searchData = search(item.data, key, filter)
            $('#bd-show-data div').remove()
            $('#curr-page').text(item.curr_page)
            $('.sum-data').text('共' + Math.ceil(item.searchData.length / pageDataSum)+ '页')
            createPageData(item)
        } else {
            $(filterID).val('去对应页面搜索吧')
        }
    });
    
    // 双击card时跳转，如果有链接时
    $(showDataContainerID).on('dblclick', '.card' , function() {
        this.querySelector('a').click()
    });

    // 单击徽章
    $(showDataContainerID).on('click', '.card .badge' , function() {
        const key = $(this).attr('key')
        const filter = $(this).text()
        const item = leftMeunItems[$('a.nav-link').index($('a.nav-link.active'))]
        item.searchData = search(item.data, key, filter)
        $('#bd-show-data div').remove()
        $('#curr-page').text(item.curr_page)
        $('.sum-data').text('共' + Math.ceil(item.searchData.length / pageDataSum)+ '页')
        createPageData(item)
    });
    initLeftMeun()

    // 初始化数据
    leftMeunItems.forEach(item => {
        // 初始化leftmenu显示
        showCurrPage(1)
        initData(item)
         // 页面数据构造
         switch (item.index) {
            case noticePage:
                $(noticeID).html(item.data)
                $(noticeID).removeClass('loading')
                $(item.id + ' .lead').html(item.data)
                $(item.id + ' .lead').removeClass('loading')
                console.log(11)
                break;
            case startPage:
                $(item.id + ' .jumbotron').html(item.data)
                $(item.id + ' .jumbotron').removeClass('loading')
                break;
            case aboutPage:
                $(item.id + ' .jumbotron').html(item.data)
                $(item.id + ' .jumbotron').removeClass('loading')
                break;
            case unicourPage:
            case othcourPage:
            case panknowPage:
            case booksPage:
                item.searchData = search(item.data, 0, '')
                item.curr_page = item.searchData.length > 0 ? 1 : 0
                $(item.id + '-sum').text(item.data.length - 1)
                break;
            case commPage:
                commPageState(0)
                break;
        }
    });

    // 左侧菜单点击时构造页面数据
    $('a.nav-link').click(function() {
        const index = $('a.nav-link').index(this)
        const item = leftMeunItems[index]
        $(this).addClass('active')
        $(this).siblings().removeClass('active')
        $('#bd-show-data div').remove()
        // 页面数据构造
        switch (item.index) {
            case noticePage:
            case startPage:
            case aboutPage:
                showCurrPage(item.index)
                break;
            case unicourPage:
            case othcourPage:
            case panknowPage:
            case booksPage:
                showCurrPage(3)
                createPageData(item)
                $('.sum-data').text('共' + Math.ceil(item.searchData.length / pageDataSum)+ '页')
                $('#curr-page').text(item.curr_page)
                break;
            case commPage:
                showCurrPage(4)
                break;
        }
    })

    // 分页点击数据加载
    $('.pagination').on('click', '.page-link', function() {
        var item = leftMeunItems[$('a.nav-link').index($('a.nav-link.active'))]
        $('#bd-show-data div').remove()    // 先清除页面数据
        // 点击上一页
        if ($(this).attr('aria-label') == 'Previous') {
            if (item.curr_page - 1 > 0) {
                item.curr_page -= 1
            }
        }// 点击下一页时
        else if ($(this).attr('aria-label') == 'Next') {
            if (item.curr_page + 1 <= Math.ceil(item.searchData.length / pageDataSum)) {
                item.curr_page += 1
            }
        } else {

        }
        $('#curr-page').text(item.curr_page)
        createPageData(item)
    });

    function showCurrPage(pageIndex) {
        for (let index = 0; index < pageStateItems.length; index++) {
            const pageStateFunc = pageStateItems[index];
            if (pageIndex == index) {
                pageStateFunc(1)
            } else {
                pageStateFunc(0)
            }
        }
    }

    function pageState(pageID, state) {
        switch (state) {
            case 0:
                $(pageID).hide()
                break;
            case 1:
                $(pageID).show()
                break;
        }
    }

    function noticePageState(state) {
        pageState(noticePageID, state)
    }

    function startPageState(state) {
        pageState(startPageID, state)
    }

    function aboutPageState(state) {
        pageState(aboutPageID, state)
    }

    function showDataPageState(state) {
        ['.bd-lables', '#bd-show-data', '.bd-sum'].forEach(k=>{
            pageState(k, state)
        })
    }

    function commPageState (state) {
        pageState(commPageID, state)
    }

    $(window).scroll(function(){
        $("#bd-lmenu").removeClass("show")
    })

    function initLeftMeun() {
        if($(this).width() >= 768) {
            $("#bd-lmenu").addClass("show")
        } else {
          $("#bd-lmenu").removeClass("show")
        }
        $(window).resize(function(){
          if($(this).width() >= 768) {
            $("#bd-lmenu").addClass("show")
          } else {
            $("#bd-lmenu").removeClass("show")
          }
        })
    }

     /**
     * 通过文件初始化页面数据
     * @param {object} item
     */
    function initData(item) {
        $.get({
            url: item.url,
            async: false,
            success: function(r_data) {
                console.log("获取数据源:" + item.url + "成功")
                switch (item.index) {
                    case noticePage:
                    case startPage:
                    case aboutPage:
                        item.data = r_data
                        break;
                    case unicourPage:
                    case othcourPage:
                    case panknowPage:
                    case booksPage:
                        item.data = $.csv.toArrays(r_data)
                        break;
                    case commPage:
                        // TODO
                        break;
                }
            },
            error:function(r_data) {
                console.error("获取数据源:" + item.url + "失败")
            }
        })
    }

    function createPageData(item) {
        var index = (item.curr_page - 1) * pageDataSum
        index = index < 0 ? 0: index
        for (; index < pageDataSum * item.curr_page && index < item.searchData.length; index++) {
            const row = item.searchData[index];
            item.callback(row)
        }
    }

    /**
     * 构造大学课程页面数据
     * @param {Array<String>} row
     */
     function initUnicour(row) {
        $(showDataContainerID).append('<div class="card mb-3 shadow rounded">'
            + '<div class="row no-gutters">'
            + '<div class="col-md-4 bg-light">'
            + '<img src="' + getDataPgaeImage(row[5]) + '" class="card-img" alt="图片来源网络，侵删除">'
            + '</div>'
            + '<div class="col-md-8">'
            + '<div class="card-body">'
            + '<h5 class="card-title"><a href="'+ row[5]  +'">' + row[1] + '</a></h5>'
            + '<p class="card-text">' + row[8] 
            + '<span class="badge badge-pill badge-primary" key="2" data-toggle="tooltip" data-placement="bottom" title="' + row[2] + '">' + row[2] + '</span>'
            + '<span class="badge badge-pill badge-primary" key="3" data-toggle="tooltip" data-placement="bottom" title="' + row[3] + '">' + row[3] + '</span>'
            + '<span class="badge badge-pill badge-primary" key="4" data-toggle="tooltip" data-placement="bottom" title="' + row[4] + '">' + row[4] + '</span>'
            + '</p>'
            + '<p class="card-text recommend">' + row[7] + '</p>'
            + '<footer class="blockquote-footer text-right">' + row[0] + '</footer>'
            + '</div>'
            + '</div>'
            + '</div>'
            + '</div>')
        $('[data-toggle="tooltip"]').tooltip()
    }

     /**
     * 构造其他课程页面数据
     * @param {Array<String>} row
     */
    function initOthcour(row) {
        $(showDataContainerID).append('<div class="card mb-3 shadow rounded">' 
            + '<div class="row no-gutters">'
            + '<div class="col-md-4 bg-light">'
            + '<img src="' + getDataPgaeImage() + '" class="card-img" alt="图片来源网络，侵删除">'
            + '</div>'
            + '<div class="col-md-8">'
            + '<div class="card-body">'
            + '<h5 class="card-title"><a href="'+ row[5]  +'">' + row[1] + '</a></h5>'
            + '<p class="card-text">' + row[7] 
            + '<span class="badge badge-pill badge-primary" key="2" data-toggle="tooltip" data-placement="bottom" title="' + row[2] + '">' + row[2] + '</span>'
            + '<span class="badge badge-pill badge-primary" key="3" data-toggle="tooltip" data-placement="bottom" title="' + row[3] + '">' + row[3] + '</span>'
            + '<span class="badge badge-pill badge-primary" key="4" data-toggle="tooltip" data-placement="bottom" title="' + row[4] + '">' + row[4] + '</span>'
            + '</p>'
            + '<p class="card-text recommend">' + row[6]  + '</p>'
            + '<footer class="blockquote-footer text-right">' + row[0] + '</footer>'
            + '</div>'
            + '</div>'
            + '</div>'
            + '</div>')
        $('[data-toggle="tooltip"]').tooltip()
    }

    /**
     * 构造泛知识UP页面数据
     * @param {Array<String>} row
     */
     function initPanknowup(row) {
        $(showDataContainerID).append('<div class="card mb-3 shadow rounded">'
            + '<div class="row no-gutters">'
            + '<div class="col-md-4 bg-light">'
            + '<img src="' + getDataPgaeImage() + '" class="card-img" alt="图片来源网络，侵删除">'
            + '</div>'
            + '<div class="col-md-8">'
            + '<div class="card-body">'
            + '<h5 class="card-title"><a href="'+ row[4]  +'">' + row[1] + '</a></h5>'
            + '<p class="card-text">' + row[6] 
            + '<span class="badge badge-pill badge-primary" key="1" data-toggle="tooltip" data-placement="bottom" title="' + row[1] + '">' + row[1] + '</span>'
            + '<span class="badge badge-pill badge-primary" key="2" data-toggle="tooltip" data-placement="bottom" title="' + row[2] + '">' + row[2] + '</span>'
            + '<span class="badge badge-pill badge-primary" key="3" data-toggle="tooltip" data-placement="bottom" title="' + row[3] + '">' + row[3] + '</span>'
            + '</p>'
            + '<p class="card-text recommend">' + row[5] + '</p>'
            + '<footer class="blockquote-footer text-right">' + row[0] + '</footer>'
            + '</div>'
            + '</div>'
            + '</div>'
            + '</div>')
        $('[data-toggle="tooltip"]').tooltip()
    }

    /**
     * 构造书籍推荐页面数据
     * @param {Array<String>} row
     */
     function initBooks(row) {
        $(showDataContainerID).append('<div class="card mb-3 shadow rounded">'
            + '<div class="row no-gutters">'
            + '<div class="col-md-4 bg-light">'
            + '<img src="' + getDataPgaeImage() + '" class="card-img" alt="图片来源网络，侵删除">'
            + '</div>'
            + '<div class="col-md-8">'
            + '<div class="card-body">'
            + '<h5 class="card-title"><a href="'+ '#'  +'">' + row[1] + '</a></h5>'
            + '<p class="card-text">' + row[4] 
            + '<span class="badge badge-pill badge-primary" key="2" data-toggle="tooltip" data-placement="bottom" title="' + row[2] + '">' + row[2] + '</span>'
            + '</p>'
            + '<p class="card-text recommend">' + row[3] + '</p>'
            + '<footer class="blockquote-footer text-right">' + row[0] + '</footer>'
            + '</div>'
            + '</div>'
            + '</div>'
            + '</div>')
        $('[data-toggle="tooltip"]').tooltip()
    }

    function getDataPgaeImage() {
        key = randomNum(0, 28)
        return 'imgs/' + key + '.webp'
    }

    // 生成从minNum到maxNum的随机数
    // by菜鸟教程 
    function randomNum(minNum,maxNum){ 
        switch(arguments.length){ 
            case 1: 
                return parseInt(Math.random()*minNum+1,10); 
            break; 
            case 2: 
                return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
            break; 
                default: 
                    return 0; 
                break; 
        } 
    } 

    function initFilter(filter) {
        return  new RegExp('.*' + filter + '.*')
    }

    //搜索功能dome
    function search(source, key, filter) {
        filter = initFilter(filter)
        var searchRs = new Array()
        for (let index = 1; index < source.length; index++) { // 从第二条开始过滤，第一条是表头
            const rowData = source[index]
            if(rowData[key] != undefined && rowData[key] != '' && rowData[key].search(filter) == 0) {
                searchRs.push(rowData)
            }
        }
        return searchRs
    }

    // gitalk
    const gitalk = new Gitalk({
        clientID: '04c2dd790817eed71f92',
        clientSecret: 'e2bac1804a381c9504baf7e78acffea9cf720ff7',
        repo: 'levartsang.github.io',      // The repository of store comments,
        owner: 'levartsang',
        admin: ['levartsang'],
        id: location.pathname,      // Ensure uniqueness and length less than 50
        distractionFreeMode: false  // Facebook-like distraction free mode
      })
      gitalk.render('gitalk-container')
      $.get({
          url:'https://api.github.com/repos/levartsang/levartsang.github.io/issues',
          success:function(resp) {
            $("#messboard-sum").text(resp[0].comments)
          }
      })
})