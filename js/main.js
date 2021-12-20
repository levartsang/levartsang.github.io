$(function(){
    // 参数设置
    const unicourID = "#unicour"
    const othcourID = "#othcour"
    const panknowupID = "#panknowup"
    const booksID = "#books"
    const noticeID = "#notice"
    const noticePath = "data/notice_data.dat"
    const pageDataSum = 8
    // 需要初始化页面的参数
    items = [
        {
            curr:0,
            url:"data/unicour_data.csv",
            id:"#unicour",
            data:[],
            curr_page:1,
            isInit:false,
            callback: initUnicour
        },
        {
            curr:1,
            url:"data/othcour_data.csv",
            id:"#othcour",
            data:[],
            curr_page:1,
            isInit:false,
            callback: initOthcour
        },
        {
            curr:2,
            url:"data/panknowup_data.csv",
            id:"#panknowup",
            data:[],
            isInit:false,
            curr_page:1,
            callback: initPanknowup
        },
        {
            curr:3,
            url:"data/books_data.csv",
            id:"#books",
            data:[],
            isInit:false,
            curr_page:1,
            callback: initBooks
        }
    ]

    // 获取页面初始化数据
    items.forEach(ele => {
        ele.data = initData(ele.url);
        $(ele.id + '-sum').text(ele.data.length)
    });
    
    // 公告
    initNotice(noticePath)

    // 左侧菜单动态设置
    initLeftMeun();

    // 左侧菜单点击时构造数据
    // 且只构造一次
    $('a.nav-link').click(function() {
        var curr_item = items[$('a.nav-link').index(this) - 1]
        if (!curr_item.isInit) {
            initPaging(curr_item)
            initPageData(curr_item)
            curr_item.isInit = true
        }
    })

    // 分页点击数据加载
    $('.pagination').on('click', '.page-link', function() {
        var curr_item = items[$(this).parent().parent().attr('item')]
        $(curr_item.id + ' tr').remove()
        curr_item.curr_page = $(this).attr('page')
        if ($(this).attr('aria-label') == 'Previous') {
            curr_item.curr_page = parseInt($($(this).parent().siblings()[0]).children('a').attr('page')) - 1
                if (curr_item.curr_page > 0) {
                    for (let s = 0 ; s < [$(this).parent().siblings()][0].length && s < 3; s++) {
                        const sibling = [$(this).parent().siblings()][0][s];
                        $(sibling).children('a').attr('page', parseInt($(sibling).children('a').attr('page')) - 1)
                        $(sibling).children('a').text(parseInt($(sibling).children('a').text()) - 1)
                    }
                } else {
                    curr_item.curr_page = $($(this).parent().siblings()[0]).children('a').attr('page')
                }
        }
        if ($(this).attr('aria-label') == 'Next') {
            curr_item.curr_page = parseInt($($(this).parent().siblings()[3]).children('a').attr('page')) + 1
            if (curr_item.curr_page <= Math.ceil(curr_item.data.length / pageDataSum)) {
                for (let s = 1 ; s < [$(this).parent().siblings()][0].length && s <= 3; s++) {
                    const sibling = [$(this).parent().siblings()][0][s];
                    $(sibling).children('a').attr('page', parseInt($(sibling).children('a').attr('page')) + 1)
                    $(sibling).children('a').text(parseInt($(sibling).children('a').text()) + 1)
                }
            } else {
                curr_item.curr_page = parseInt($($(this).parent().siblings()[3]).children('a').attr('page'))
            }
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
        var cp = item.curr_page
        var data = item.data
        // 一次只加载8条数据
        for (let index = (cp - 1) * pageDataSum + 1; index < data.length && index <= cp * pageDataSum; index++) { // 为什么从第二个数据开始？csv第一行是表头
            const curr_row_data = data[index];
            item.callback(curr_row_data)
        }
        item.curr_page++; // 页数+1
        $('[data-toggle="tooltip"]').tooltip()
    }

    function initPaging(item) {
        var s = item.curr_page
        var e = item.data.length / item.curr_page
        for (let index = s; index <= 3 && index <= e; index++){
            $(item.id + '-paging li:last-child').before('<li class="page-item"><a class="page-link"'
                + 'page="' + index + '">'
                + index + '</a></li>')
        }
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
                $(noticeID).text(r_data)
            },
            error:function() {
                console.log("获取公告" + path + "失败")
                $(noticeID).text('...(*￣０￣)ノ[这家伙很懒，什么都没留下...]');
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
})