/* 
  WORKBENCH URL: https://bksdevsite.sharepoint.com/_layouts/15/workbench.aspx 

  npm install react-html-parser --save
  npm install @pnp/sp --save

*/

//#region [imports]

  import * as React from 'react';
  import styles from './ContentSliderSpFxClientSideWebPart.module.scss';
  import { IContentSliderSpFxClientSideWebPartProps } from './IContentSliderSpFxClientSideWebPartProps';
  import { escape } from '@microsoft/sp-lodash-subset';

  import { sp } from "@pnp/sp";
  import { Web } from "@pnp/sp/webs";
  import "@pnp/sp/lists";
  import "@pnp/sp/items";
  import { IWeb, IWebInfo } from '@pnp/sp/webs';

  import parse from 'react-html-parser';


//#endregion

//#region [interfaces]
  
  export interface iState {
    data: iSPList[];
  }

  export interface iSPList {
    Id: number;
    Title: string; 
    Content: string;
    AttachmentFiles: iSPAttachmentFile[]; 
    Hyperlink: spLink; 
    Modified: Date;
  }

  export interface iSPAttachmentFile {
    FileName: string; 
    ServerRelativeUrl: string;
  }

  export interface spLink {
    description: string; 
    Url: URL;
  }

//#endregion

//#region [Constants]

  const defaultBackground: any = require('../assets/default.jpg');

  //#endregion

//#region [variables]

  let isFirstMarked: boolean = false; 

//#endregion

export default class ContentSliderSpFxClientSideWebPart 
  extends React.Component<IContentSliderSpFxClientSideWebPartProps, iState> {

  //#region [constructor]

    public constructor (props:IContentSliderSpFxClientSideWebPartProps) {
      super(props); 
      this.state = {
        data: []
      };
    }

  //#endregion

  //#region [hooks]

    public componentDidMount() {
      this.getData(); 
    }

  //#endregion

  //#region [components]

    private slide = ({props}) => {
      let bgImage: string; 
      try {
        bgImage = 'url(' + this.props.gThis.context.pageContext.web.absoluteUrl + props.AttachmentFiles[0].ServerRelativeUrl + ')';
      }
      catch(err) {
        bgImage = 'url(' + defaultBackground + ')';
      }
      return (
        <div className={styles.contents} style={{backgroundImage: bgImage}}>
          <h2 className={styles.caption}>{escape(props.Title)}</h2>
          <p className={styles.text}>
            {parse(props.Content)}<br />
            <a href={props.Hyperlink.Url}>Read More...</a>
          </p>
        </div>
      );     
    }

    private slideContainer = ({children}) => {
      return (
        <div className={styles.slider}>{children}</div>
      ); 
    }

    private slideInner  = ({children, divSize}) => {
      return (
        <div id="slider_inner" className={styles.inner} style={{width: divSize}}>{children}</div>
      );
    }
    
    private slideNav = ({id, caption}) => {      
      
      const clickHandler = (radioID) => {
        const x = (100 / this.state.data.length) * (radioID - 1);
        document.getElementById('slider_inner').style.transform = "translateX(-" + x +"%)";
        let cnt: number = 0;        
        this.state.data.map((item: iSPList) => {
          document.getElementById("radio"+item.Id).style.outline = "6px solid white";
        });
        document.getElementById("radio"+id).style.outline = "6px solid gray";
      };

      if (isFirstMarked == false) { 
        isFirstMarked = true; 
        return (
          <input type="radio" key={id} id={"radio"+id} name="slider" title={caption}  style={{outline: '6px solid gray'}} className={styles.navigation} onClick={() => clickHandler(id)} />
        ); 
       } else {
        return (
          <input type="radio" key={id} id={"radio"+id} name="slider" title={caption}  checked={false} className={styles.navigation} onClick={() => clickHandler(id)} />
        ); 
      }
    }

  //#endregion

  //#region [render]
  
    public render(): 
      React.ReactElement<IContentSliderSpFxClientSideWebPartProps> {
  
        const innerWidth: string = (this.state.data.length * 100) + "%";  
        
        return (
          <div className={ styles.contentSliderSpFxClientSideWebPart }>
            <this.slideContainer>
              {this.state.data.map((item: iSPList) => {
                return (
                  <this.slideNav id={item.Id} caption={item.Title} />
                );
              })}
              <this.slideInner divSize={innerWidth}>
                {this.state.data.map((item: iSPList) => {
                  return (
                    <this.slide props={item}></this.slide>
                      
                  );
                })}
              </this.slideInner>
            </this.slideContainer>
          </div>
        );
      }
  
  //#endregion

  //#region [data]

  private async getData()  {
    const spWeb = Web(this.props.gThis.context.pageContext.web.absoluteUrl);
    const items: any[] = await spWeb.lists.getByTitle("Slides").items.select("Id", "Title", "Content", "Hyperlink", "AttachmentFiles").expand("AttachmentFiles").top(4).orderBy("Id", true).get();
    this.setState({data: items});
  }



  //#endregion

}