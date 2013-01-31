(function($) {
    $(document).ready(function() {
        
        //Click Functions
        $('#northWest').click(function () {
            document.location.href = "http://paac.webizly.biz/coalition/northwest-regional-action-coalition"; 
        });
        
        $('#southWest').click(function () {
            document.location.href = "http://paac.webizly.biz/coalition/southwest-regional-action-coalition";
        });
        
        $('#northCentral').click(function () {
            document.location.href = "http://paac.webizly.biz/coalition/north-central-regional-action-coalition";
        });
        
        $('#southCentral').click(function () {
            document.location.href = "http://paac.webizly.biz/coalition/south-central-regional-action-coalition";
        });
        
        $('#northEast').click(function () {
            document.location.href = "http://paac.webizly.biz/coalition/northeast-regional-action-coalition";
        });
        
        $('#southEast1').click(function () {
            document.location.href = "http://paac.webizly.biz/coalition/southeast-regional-action-coalition-1";
        });
        
        $('#southEast2').click(function () {
            document.location.href = "http://paac.webizly.biz/coalition/southeast-regional-action-coalition-2";
        });
        
        
        
        //Hover Functions
        $('#northWest').hover(function () {
            $('#map').addClass('northWestHover');
            //$('#northWest').addClass('northWestHover');
        }, function () {
            $('#map').removeClass('northWestHover')
            $('#northWest').removeClass('northWestHover')
        });//
        
        $('#southWest').hover(function () {
            $('#map').addClass('southWestHover');
            //('#southWest').addClass('southWestHover');
        }, function () {
            $('#map').removeClass('southWestHover')
            //$('#southWest').removeClass('southWestHover')
        });
        
        $('#northCentral').hover(function () {
            $('#map').addClass('northCentralHover');
            //$('#northCentral').addClass('northCentralHover');
        }, function () {
            $('#map').removeClass('northCentralHover')
            //$('#northCentral').removeClass('northCentralHover')
        });
        
        $('#southCentral').hover(function () {
            $('#map').addClass('southCentralHover');
            //$('#southCentral').addClass('southCentralHover');
        }, function () {
            $('#map').removeClass('southCentralHover')
            //$('#southCentral').removeClass('southCentralHover')
        });
        
        $('#northEast').hover(function () {
            $('#map').addClass('northEastHover');
            //$('#northEast').addClass('northEastHover');
        }, function () {
            $('#map').removeClass('northEastHover')
            //$('#northEast').removeClass('northEastHover')
        });
        
        $('#southEast1').hover(function () {
            $('#map').addClass('southEast1Hover');
            //$('#southEast1').addClass('southEast1Hover');
        }, function () {
            $('#map').removeClass('southEast1Hover')
            //$('#southEast1').removeClass('southEast1Hover')
        });
        
        $('#southEast2').hover(function () {
            $('#map').addClass('southEast2Hover');
            //$('#southEast2').addClass('southEast2Hover');
        }, function () {
            $('#map').removeClass('southEast2Hover')
            //$('#southEast2').removeClass('southEast2Hover')
        });
        
        
        
    });
})(jQuery);