$(function(){
    // 参数设置
    const unicourID = "#unicour"
    const othcourID = "#othcour"
    const panknowupID = "#panknowup"
    const booksID = "#books"
    const noticeID = "#notice"
    const noticePath = "data/notice_data.dat"
    // 需要初始化页面的参数
    var callbacks = [
        {
            url:"data/unicour_data.csv",
            sumID: unicourID + "-sum",
            callback: initUnicour
        },
        {
            url:"data/othcour_data.csv",
            sumID: othcourID + "-sum",
            callback: initOthcour
        },
        {
            url:"data/panknowup_data.csv",
            sumID: panknowupID + "-sum",
            callback: initPanknowup
        },
        {
            url:"data/books_data.csv",
            sumID: booksID + "-sum",
            callback: initBooks
        }
    ]

    // 公告
    initNotice(noticePath)

    // 左侧菜单动态设置
    initLeftMeun();

    // 初始化页面数据
    callbacks.forEach(ele => {
        initData(ele.url, ele.sumID, ele.callback);
    });

    /**
     * 构造大学课程页面数据
     * @param {Array<String>} ele
     */
    function initUnicour(ele) {
        $(unicourID).append('<tr>'
        + '<td class="unicour_id" data-toggle="tooltip" data-placement="bottom" title="'+ ele[0] + '">' + ele[0] + '</td>'
        + '<td class="unicour_cour" data-toggle="tooltip" data-placement="bottom" title="' + ele[1] + '"><a href="' + ele[5] + '">' + ele[1] + '</a></td>'
        + '<td class="unicour_tec" data-toggle="tooltip" data-placement="bottom" title="'+ ele[2] + '">' + ele[2] + '</td>'
        + '<td class="unicour_major" data-toggle="tooltip" data-placement="bottom" title="'+ ele[3] + '">' + ele[3] + '</td>'
        + '<td class="unicour_plat" data-toggle="tooltip" data-placement="bottom" title="'+ ele[4] + '">' + ele[4] + '</td>'
        + '<td class="unicour_comm" data-toggle="tooltip" data-placement="bottom" title="'+ ele[6] + '">' + ele[6] + '</td>'
        + '<td class="unicour_date" data-toggle="tooltip" data-placement="bottom" title="'+ ele[8] + '">' + ele[8] + '</td>'
        + '</tr>')
    }

     /**
     * 构造其他课程页面数据
     * @param {Array<String>} ele
     */
      function initOthcour(ele) {
        $(othcourID).append('<tr>'
        + '<td class="unicour_id" data-toggle="tooltip" data-placement="bottom" title="'+ ele[0] + '">' + ele[0] + '</td>'
        + '<td class="unicour_cour" data-toggle="tooltip" data-placement="bottom" title="' + ele[1] + '"><a href="' + ele[5] + '">' + ele[1] + '</a></td>'
        + '<td class="unicour_tec" data-toggle="tooltip" data-placement="bottom" title="'+ ele[2] + '">' + ele[2] + '</td>'
        + '<td class="unicour_major" data-toggle="tooltip" data-placement="bottom" title="'+ ele[4] + '">' + ele[4] + '</td>'
        + '<td class="unicour_comm" data-toggle="tooltip" data-placement="bottom" title="'+ ele[6] + '">' + ele[6] + '</td>'
        + '<td class="unicour_date" data-toggle="tooltip" data-placement="bottom" title="'+ ele[7] + '">' + ele[7] + '</td>'
        + '</tr>')
    }
   
     /**
     * 构造泛知识UP页面数据
     * @param {Array<String>} ele
     */
      function initPanknowup(ele) {
        $(panknowupID).append('<tr>'
        + '<td class="unicour_id" data-toggle="tooltip" data-placement="bottom" title="'+ ele[0] + '">' + ele[0] + '</td>'
        + '<td class="unicour_cour" data-toggle="tooltip" data-placement="bottom" title="' + ele[1] + '"><a href="' + ele[4] + '">' + ele[1] + '</a></td>'
        + '<td class="unicour_tec" data-toggle="tooltip" data-placement="bottom" title="'+ ele[2] + '">' + ele[2] + '</td>'
        + '<td class="unicour_major" data-toggle="tooltip" data-placement="bottom" title="'+ ele[3] + '">' + ele[3] + '</td>'
        + '<td class="unicour_comm" data-toggle="tooltip" data-placement="bottom" title="'+ ele[5] + '">' + ele[5] + '</td>'
        + '<td class="unicour_date" data-toggle="tooltip" data-placement="bottom" title="'+ ele[6] + '">' + ele[6] + '</td>'
        + '</tr>')
    }

     /**
     * 构造书籍推荐页面数据
     * @param {Array<String>} ele
     */
      function initBooks(ele) {
        $(booksID).append('<tr>'
        + '<td class="unicour_id" data-toggle="tooltip" data-placement="bottom" title="'+ ele[0] + '">' + ele[0] + '</td>'
        + '<td class="unicour_cour" data-toggle="tooltip" data-placement="bottom" title="' + ele[1] + '"><a href="' + "#" + '">' + ele[1] + '</a></td>'
        + '<td class="unicour_tec" data-toggle="tooltip" data-placement="bottom" title="'+ ele[2] + '">' + ele[2] + '</td>'
        + '<td class="unicour_major" data-toggle="tooltip" data-placement="bottom" title="'+ ele[3] + '">' + ele[3] + '</td>'
        + '<td class="unicour_comm" data-toggle="tooltip" data-placement="bottom" title="'+ ele[4] + '">' + ele[4] + '</td>'
        + '</tr>')
    }

    /**
     * 构造页面数据
     * @param {Array<String>} r_data 
     * @param {String} sumID
     * @param {Function} callback
     */
    function initPageData(r_data, sumID, callback) {
        $(sumID).text(r_data.length - 1)
        for (let index = 1; index < r_data.length; index++) { // 为什么从第二个数据开始？csv第一行是表头
            const ele = r_data[index];
            callback(ele)
        }
    }

    /**
     * 通过data.csv文件构建页面数据
     * @param {String} data_f
     * @param {String} sumID
     * @param {Function} callback 
     */
    function initData(data_f, sumID, callback)　{
        $.get({
            url:data_f,
            success:function(r_data) {
                console.log("获取数据源:" + data_f + "成功")
                var ind = $.csv.toArrays(r_data);
                initPageData($.csv.toArrays(r_data), sumID, callback)
                $('[data-toggle="tooltip"]').tooltip() 
            },
            error:function(r_data) {
                console.error("获取数据源:" + data_f + "失败")
            }
        })
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
})