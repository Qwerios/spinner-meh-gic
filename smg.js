/**
 * @description canvas based spinner widget
 *
 * @namespace
 * @name spinner-meh-gic
 * @version 1.0
 * @author mdoeswijk
 */
;(function( $ )
{
    // Support functions
    //
    function deg2rad( degrees )
    {
        return parseFloat( ( Math.PI / 180 ) * degrees );
    }

    function rad2deg( radials )
    {
        return parseFloat( radials / ( Math.PI / 180 ) );
    }
    
    // The spinner widget
    //    
    $.widget( "ees.spinnerMehGic",
    {
        options: 
        {
            widgetClass:        "eesSpinner"
        ,   autoStart:          true
        ,   hideOnStop:         false
        ,   interval:           120
            
        ,   height:             48
        ,   width:              48
        
        ,   partSize:           12  // Degrees
        ,   gapSize:            24  // Degrees
        ,   spread:             360 // Degrees
        
        ,   outerRadius:        0.9 
        ,   innerRadius:        0.4
        
        ,   color:              "0,0,0"    // R, G, B as a single string
        ,   style:              "straight" // Either 'straight', 'pie' or 'swirl'
        }
    
    ,   _timer: null
    ,   _ctx:   null

    ,   _create: function( params )
        {
            var widget = this;
            var $item  = widget.element;

            widget.options = $.extend( widget.options, params );

            var options = widget.options;
            $item.addClass( options.widgetClass );
            
            // Create the canvas element
            //
            var canvas    = document.createElement( "canvas" );
            canvas.width  = options.width;
            canvas.height = options.height;
            
            $item.append( canvas );
            
            // Check for excanvas
            //
            if ( typeof G_vmlCanvasManager != 'undefined' )
            {
                canvas = G_vmlCanvasManager.initElement( canvas );
            }
            widget._ctx = canvas.getContext( "2d" );
            
            if ( options.autoStart )
            {
                widget.start();
            }
        }
        
    ,   _drawParts: function( pos )
        {
            var widget  = this;
            var options = widget.options;
            
            var ctx         = widget._ctx;
            var height      = ctx.canvas.height / 2;
            var width       = ctx.canvas.width  / 2; 
            var stepSize    = options.partSize + options.gapSize;
            var stepCount   = Math.ceil( options.spread / stepSize );
            var count       = 0;
            
            for ( var i = pos; i < pos + options.spread; i += stepSize )
            {
                ctx.beginPath();                
                ctx.fillStyle = "rgba(" + options.color + "," + ( ( 1 / stepCount ) * count ) + ")";
                                
                ctx.arc( width, height, ( Math.min( width, height ) * options.outerRadius  ), deg2rad( i ), deg2rad( i + options.partSize ), false );
                
                switch ( options.style )
                {
                    case "swirl":
                        // Swirl
                        //                
                        ctx.arc( width, height, ( Math.min( width, height ) * options.innerRadius ), deg2rad( i + options.partSize + stepSize ), deg2rad( i + stepSize ), true  );                    
                    break;
                
                    case "straight":
                        // Straight lines (sort off)
                        //
                        ctx.arc( width, height, ( Math.min( width, height ) * options.innerRadius ), deg2rad( i + options.partSize * 2 ), deg2rad( i ), true  );                    
                    break;
                
                    default:
                        // Pie chart like
                        //
                        ctx.arc( width, height, ( Math.min( width, height ) * options.innerRadius ), deg2rad( i + options.partSize ), deg2rad( i ), true  );                    
                    break;
                }                
                
                ctx.fill();                
                count++;
            }            
        }
        
    ,   setOptions: function( params )
        {
            var widget = this;
            widget.options = $.extend( widget.options, params );
        }
        
    ,   start: function()
        {
            var widget  = this;
            var $item   = widget.element;
            var options = widget.options;
            
            if ( widget._timer )
            {
                // Already running
                //
                return;
            }
            
            if ( options.hideOnStop )
            {
                $item.show();
            }
            
            var ctx = widget._ctx;
            var pos = -1 * options.partSize + options.gapSize;

            // Initial update
            //
            widget._drawParts( pos );

            // The redraw loop
            //            
            widget._timer = setInterval( function()
            {             
                ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
                
                pos += options.partSize + options.gapSize;
                widget._drawParts( pos );
            }, options.interval );
        
        }
        
    ,   stop: function()
        {
            var widget  = this;
            var $item   = widget.element;

            clearInterval( widget._timer );
            widget._timer = null;
            
            if ( widget.options.hideOnStop )
            {
                $item.hide();
            }
        }
    } );
} )( jQuery );