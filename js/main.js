$(function(){
    // 参数配置
    // 可以手动修改
    //==================页面数据表格id=======================
    //一般不需要更改
    const unicourID = "#unicour"
    const othcourID = "#othcour"
    const panknowupID = "#panknowup"
    const booksID = "#books"
    const noticeID = "#notice"
    //==================页面数据源，结构是固定的================
    //直接用word打开编辑
    const unicourDataPath = "data/unicour_data.csv"
    const othcourDataPath = "data/othcour_data.csv"
    const panknowDataPath = "data/panknowup_data.csv"
    const booksDataPath = "data/books_data.csv"
    const noticePath = "data/notice_data.dat"

    const pageDataSum = 8   // 默认一页显示几条数据
     //==================更改下面逻辑代码有一定风险=============
    // don't modify
    // 下面逻辑代码一般不需要更改
    //=======================================================
    // 需要初始化页面的参数
    items = [
        {
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
            url:booksDataPath,
            id:booksID,
            data:[],
            searchData:[],
            isInit:false,
            curr_page:0,
            step:1,
            callback: initBooks
        }
    ]

     // 公告
     initNotice(noticePath)

    // 获取页面初始化数据
    items.forEach(ele => {
        ele.data = initData(ele.url);
        $(ele.id + '-sum').text(ele.data.length)
    });
    
    // 左侧菜单动态设置
    initLeftMeun();

    // 左侧菜单点击时构造数据
    // 且只构造一次
    $('a.nav-link').click(function() {
        var curr_item = items[$('a.nav-link').index(this) - 1]
        if (!curr_item.isInit) {
            curr_item.searchData = search(curr_item.data, 0, '') // 去掉表头数据
            if (curr_item.searchData.length > 0) {
                curr_item.curr_page = 1
            }
            initPageData(curr_item)
            initPaging(curr_item)
            curr_item.isInit = true
        }
    })

    // 分页点击数据加载
    $('.pagination').on('click', '.page-link', function() {
        var curr_item = items[$(this).parent().parent().attr('item')]
        $(curr_item.id + ' tr').remove()    // 先清除页面数据
        // 点击上一页时，向前加载两页
        if ($(this).attr('aria-label') == 'Previous') {
            if ((parseInt($(this).parent().next().children('a').attr('page')) - 2) > 0) {
                curr_item.curr_page = parseInt($(this).parent().next().children('a').attr('page')) - 2
                for (let s = 0 ; s < [$(this).parent().siblings()][0].length && s < 3; s++) {
                    const sibling = [$(this).parent().siblings()][0][s];
                    $(sibling).children('a').attr('page', parseInt($(sibling).children('a').attr('page')) - 2)
                    $(sibling).children('a').text(parseInt($(sibling).children('a').text()) - 2)
                }
                // 说明还有上一页
                $(this).parent().siblings().find('[page="'+(curr_item.curr_page + 1)+'"]').parent().addClass('active')
                $(this).parent().siblings().children('a').not('[page="'+(curr_item.curr_page + 1)+'"]').parent().removeClass('active')
            } else {
                // 无上一页，当前页就是当前页
                $(this).parent().siblings().find('[page="'+(curr_item.curr_page)+'"]').parent().addClass('active')
                $(this).parent().siblings().children('a').not('[page="'+(curr_item.curr_page)+'"]').parent().removeClass('active')
            }
            
        }
        // 点击下一页时，向后加载两页
        else if ($(this).attr('aria-label') == 'Next') {
            if ((parseInt($(this).parent().prev().children('a').attr('page')) + 2) 
                    <= Math.ceil(curr_item.searchData.length / pageDataSum)) {
                curr_item.curr_page = parseInt($(this).parent().prev().children('a').attr('page')) + 2
                for (let s = 1 ; s < [$(this).parent().siblings()][0].length && s <= 3; s++) {
                    const sibling = [$(this).parent().siblings()][0][s];
                    $(sibling).children('a').attr('page', parseInt($(sibling).children('a').attr('page')) + 2)
                    $(sibling).children('a').text(parseInt($(sibling).children('a').text()) + 2)
                }
                // 说明还有下一页
                $(this).parent().siblings().find('[page="'+(curr_item.curr_page - 1)+'"]').parent().addClass('active')
                $(this).parent().siblings().children('a').not('[page="'+(curr_item.curr_page - 1)+'"]').parent().removeClass('active')
            } else {
                curr_item.curr_page = parseInt($(this).parent().prev().children('a').attr('page'))
                // 无上一页，当前页就是当前页
                $(this).parent().siblings().find('[page="'+(curr_item.curr_page)+'"]').parent().addClass('active')
                $(this).parent().siblings().children('a').not('[page="'+(curr_item.curr_page)+'"]').parent().removeClass('active')
            }
        } else {
            curr_item.curr_page = $(this).attr('page')
            $(this).parent().addClass('active') // 为当前点击元素添加背景颜色
            $(this).parent().siblings().removeClass('active')
        }
        initPageData(curr_item)
    })


    /**
     * 构造大学课程页面数据
     * @param {Array<String>} ele
     */
    function initUnicour(ele) {
        $(unicourID).append('<tr>'
        + '<td class="id" data-toggle="tooltip" data-placement="bottom" title="'+ ele[0] + '">' + ele[0] + '</td>'
        + '<td class="cour" data-toggle="tooltip" data-placement="bottom" title="' + ele[1] + '"><a href="' + ele[5] + '">' + ele[1] + '</a></td>'
        + '<td class="tec" data-toggle="tooltip" data-placement="bottom" title="'+ ele[2] + '">' + ele[2] + '</td>'
        + '<td class="major" data-toggle="tooltip" data-placement="bottom" title="'+ ele[3] + '">' + ele[3] + '</td>'
        + '<td class="plat" data-toggle="tooltip" data-placement="bottom" title="'+ ele[4] + '">' + ele[4] + '</td>'
        + '<td class="comm" data-toggle="tooltip" data-placement="bottom" title="'+ ele[6] + '">' + ele[6] + '</td>'
        + '<td class="date" data-toggle="tooltip" data-placement="bottom" title="'+ ele[8] + '">' + ele[8] + '</td>'
        + '</tr>')
    }

     /**
     * 构造其他课程页面数据
     * @param {Array<String>} ele
     */
      function initOthcour(ele) {
        $(othcourID).append('<tr>'
        + '<td class="id" data-toggle="tooltip" data-placement="bottom" title="'+ ele[0] + '">' + ele[0] + '</td>'
        + '<td class="cour" data-toggle="tooltip" data-placement="bottom" title="' + ele[1] + '"><a href="' + ele[5] + '">' + ele[1] + '</a></td>'
        + '<td class="tec" data-toggle="tooltip" data-placement="bottom" title="'+ ele[2] + '">' + ele[2] + '</td>'
        + '<td class="major" data-toggle="tooltip" data-placement="bottom" title="'+ ele[4] + '">' + ele[4] + '</td>'
        + '<td class="comm" data-toggle="tooltip" data-placement="bottom" title="'+ ele[6] + '">' + ele[6] + '</td>'
        + '<td class="date" data-toggle="tooltip" data-placement="bottom" title="'+ ele[7] + '">' + ele[7] + '</td>'
        + '</tr>')
    }
   
     /**
     * 构造泛知识UP页面数据
     * @param {Array<String>} ele
     */
      function initPanknowup(ele) {
        $(panknowupID).append('<tr>'
        + '<td class="id" data-toggle="tooltip" data-placement="bottom" title="'+ ele[0] + '">' + ele[0] + '</td>'
        + '<td class="cour" data-toggle="tooltip" data-placement="bottom" title="' + ele[1] + '"><a href="' + ele[4] + '">' + ele[1] + '</a></td>'
        + '<td class="tec" data-toggle="tooltip" data-placement="bottom" title="'+ ele[2] + '">' + ele[2] + '</td>'
        + '<td class="major" data-toggle="tooltip" data-placement="bottom" title="'+ ele[3] + '">' + ele[3] + '</td>'
        + '<td class="comm" data-toggle="tooltip" data-placement="bottom" title="'+ ele[5] + '">' + ele[5] + '</td>'
        + '<td class="date" data-toggle="tooltip" data-placement="bottom" title="'+ ele[6] + '">' + ele[6] + '</td>'
        + '</tr>')
    }

     /**
     * 构造书籍推荐页面数据
     * @param {Array<String>} ele
     */
      function initBooks(ele) {
        $(booksID).append('<tr>'
        + '<td class="id" data-toggle="tooltip" data-placement="bottom" title="'+ ele[0] + '">' + ele[0] + '</td>'
        + '<td class="cour" data-toggle="tooltip" data-placement="bottom" title="' + ele[1] + '"><a href="' + "#" + '">' + ele[1] + '</a></td>'
        + '<td class="tec" data-toggle="tooltip" data-placement="bottom" title="'+ ele[2] + '">' + ele[2] + '</td>'
        + '<td class="major" data-toggle="tooltip" data-placement="bottom" title="'+ ele[3] + '">' + ele[3] + '</td>'
        + '<td class="comm" data-toggle="tooltip" data-placement="bottom" title="'+ ele[4] + '">' + ele[4] + '</td>'
        + '</tr>')
    }

    /**
     * 点击对应栏时构造页面数据
     * @param {Array<String>} r_data 
     * @param {String} sumID
     */
    function initPageData(item) {
        var cp = item.curr_page <= 0 ? 1: item.curr_page
        var index =  (cp - 1) * pageDataSum
        var flag = index
        var data = item.searchData
        // 一次只加载8条数据
        for (; index < data.length && index < cp * pageDataSum; index++) { // 为什么从第二个数据开始？csv第一行是表头
            const curr_row_data = data[index];
            item.callback(curr_row_data)
        }
        if (index != flag) {
            $('[data-toggle="tooltip"]').tooltip()
        }
    }

    function initPaging(item) {
        var s = item.curr_page
        var e = Math.ceil(item.searchData.length / pageDataSum)        
        for (let index = s; index <= e && index <= 3; index++) {
            $(item.id + '-paging li:last-child').before('<li class="page-item"><a class="page-link"'
                + 'page="' + index + '">'
                + index + '</a></li>')
        }
        $(item.id + '-paging .page-item').find('a[page="' + item.curr_page + '"]').parent().addClass('active')
    }

    /**
     * 通过data.csv文件初始化页面数据
     * @param {String} data_f
     * @param {String} sumID
     * @param {Function} callback 
     */
    function initData(url) {
        var pageData
        $.get({
            url:url,
            async:false,
            success:function(r_data) {
                console.log("获取数据源:" + url + "成功")
                pageData = $.csv.toArrays(r_data)
            },
            error:function(r_data) {
                console.error("获取数据源:" + url + "失败")
            }
        })
        return pageData
    }

    function initLeftMeun() {
        if($(this).width() >= 972) {
            $("#left-menu").addClass("show")
        } else {
          $("#left-menu").removeClass("show")
        }
        $(window).resize(function(){
          if($(this).width() >= 972) {
            $("#left-menu").addClass("show")
          } else {
          $("#left-menu").removeClass("show")
        }
        })
    }

    function initNotice(path) {
        $(noticeID).text('正在加载公告...')
        $.get({
            url:path,
            success:function(r_data){
                console.log("获取公告" + path + "成功")
                $(noticeID).html(r_data)    // 用这个方便写标签格式化数据
            },
            error:function() {
                console.log("获取公告" + path + "失败")
                $(noticeID).html('...(*￣０￣)ノ[这家伙很懒，什么都没留下...]');
            }
        })
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

    //------------------------------------------------------------
    $('button').click(function(){
        var id = $(this).attr('id')
        id = '#' + id.substr(0, id.indexOf('-'))
        var item = (()=>{
            var curr
            items.forEach(ele=>{
                if (ele.id == id) {
                   curr = ele
                   return false // break
                }
            })
            return curr
        })();
        console.log(item)
        var key = $(id + '-key option:selected').val()
        var filter = $(id + '-filter').val()
        // 清除页面数据
        $(id + ' tr').remove()
        $(item.id + '-paging>li').not(':first').not(':last').remove()
        item.searchData = search(item.data, key, filter)  // 构造搜索数据
         if (item.searchData.length > 0) items.curr_page = 1
         else item.curr_page = 0
        initPageData(item)
        initPaging(item)
    })
    function initFilter(filter) {
        return  new RegExp('.*' + filter + '.*')
    }
    //搜索功能dome
    function search(source, key, filter) {
        filter = initFilter(filter)
        var searchRs = new Array()
        for (let index = 1; index < source.length; index++) { // 从第二条开始过滤，第一条是表头
            const rowData = source[index]
            if(rowData[key].search(filter) == 0) {
                searchRs.push(rowData)
            }

        }
        return searchRs
    }
})